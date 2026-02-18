/**
 * Sync engine - orchestrates the full sync loop
 *
 * 1. Watch for file changes
 * 2. Encode changed files to root CIDs
 * 3. Diff local vs pail entries → put/del ops
 * 4. Generate UCN revision via batch (puts) + individual ops (dels)
 * 5. Upload all blocks as CAR
 * 6. Apply remote changes to local filesystem
 */

import { CID } from "multiformats/cid";
// UCN Pail imports
import { Agent, Name, NoValueError, Revision } from "@storacha/ucn/pail";
import type { NameView, ValueView } from "@storacha/ucn/pail/api";

import type {
  SyncState,
  FileChange,
  PailOp,
  DeviceConfig,
} from "./types/index.js";
import type { Block } from "multiformats";
import {
  createWorkspaceBlockstore,
  type WorkspaceBlockstore,
} from "./blockstore/index.js";
import { applyPendingOps } from "./handlers/apply.js";
import { applyRemoteChanges } from "./handlers/remote.js";
import { processChanges } from "./handlers/process.js";
import { diffRemoteChanges, type PailEntries } from "./utils/differ.js";
import { WritableCar, makeTempCar } from "./utils/tempcar.js";
import { Client } from "@storacha/client";
import { decodeDelegation, encodeDelegation } from "./utils/delegation.js";

export class SyncEngine {
  private workspace: string;
  private blocks: WorkspaceBlockstore;
  private name: NameView | null = null;
  private current: ValueView | null = null;
  private pendingOps: PailOp[] = [];
  private carFile: WritableCar | null = null;
  private running = false;
  private lastSync: number | null = null;
  private storachaClient: Client;

  constructor(storachaClient: Client, workspace: string) {
    this.storachaClient = storachaClient;
    this.workspace = workspace;
    this.blocks = createWorkspaceBlockstore(workspace);
  }

  /**
   * Initialize sync engine with device config
   */
  async init(config: DeviceConfig): Promise<void> {
    const agent = Agent.parse(config.agentKey);

    if (config.nameArchive) {
      // Restore from previously saved archive (has full state)
      const archiveBytes = decodeDelegation(config.nameArchive);
      this.name = await Name.extract(agent, archiveBytes);
    } else if (config.nameDelegation) {
      // Reconstruct from delegation (granted by another device)
      const { extract } = await import("@storacha/client/delegation");
      const nameBytes = decodeDelegation(config.nameDelegation);
      const { ok: delegation } = await extract(nameBytes);
      if (!delegation) throw new Error("Failed to extract name delegation");
      this.name = Name.from(agent, [delegation]);
    } else {
      // First device — create a new name
      this.name = await Name.create(agent);
    }

    try {
      const result = await Revision.resolve(this.blocks, this.name);
      this.current = result.value;
      await this.storeBlocks(result.additions);
    } catch (err) {
      if (err instanceof NoValueError) {
        this.current = null;
      } else {
        throw err;
      }
    }

    this.running = true;
  }

  /**
   * Process a batch of file changes
   */
  async processChanges(changes: FileChange[]): Promise<void> {
    if (!this.carFile) {
      this.carFile = await makeTempCar();
    }
    const pendingOps = await processChanges(
      changes,
      this.workspace,
      this.current,
      this.blocks,
      (block) => this.carFile!.put(block),
      (block) => this.blocks.put(block),
    );
    this.pendingOps.push(...pendingOps);
  }

  /**
   * Execute sync: generate revision, publish, upload, apply remote changes
   */
  async sync(): Promise<void> {
    if (!this.name) {
      throw new Error("Sync engine not initialized");
    }

    const beforeEntries = await this.getPailEntries();

    if (this.pendingOps.length > 0) {
      if (!this.carFile) {
        throw new Error("CAR file not initialized");
      }
      const result = await applyPendingOps(
        this.blocks,
        this.name,
        this.current,
        this.pendingOps,
      );
      this.current = result.current;
      for (const block of result.revisionBlocks) {
        await this.carFile.put(block);
      }
      await this.storeBlocks(result.revisionBlocks);
    } else {
      // No pending ops — just pull remote
      try {
        const result = await Revision.resolve(this.blocks, this.name, {
          base: this.current ?? undefined,
        });
        await this.storeBlocks(result.additions);
        this.current = result.value;
      } catch (err) {
        if (!(err instanceof NoValueError)) throw err;
      }
    }

    this.pendingOps = [];

    // Upload all accumulated blocks as CAR
    await this.possiblyUploadCAR();

    // Apply remote changes
    const afterEntries = await this.getPailEntries();
    const remoteChanges = diffRemoteChanges(beforeEntries, afterEntries);
    if (remoteChanges.length > 0) {
      await this.applyRemoteChanges(remoteChanges, afterEntries);
    }

    this.lastSync = Date.now();
  }

  /**
   * Create CAR and upload to Storacha
   */
  private async possiblyUploadCAR(): Promise<void> {
    if (this.carFile) {
      const readableCar = await this.carFile.switchToReadable();
      this.carFile = null;
      if (readableCar) {
        try {
          await this.storachaClient.uploadCAR(readableCar.readable);
        } finally {
          await readableCar.cleanup();
        }
      }
    }
  }

  /**
   * Get current pail entries as map
   */
  async getPailEntries(): Promise<PailEntries> {
    const entries: PailEntries = new Map();
    if (!this.current) return entries;

    for await (const [key, value] of Revision.entries(
      this.blocks,
      this.current,
    )) {
      const cid = value as CID;
      if (cid) entries.set(key, cid);
    }
    return entries;
  }

  /**
   * Apply remote changes to local filesystem
   */
  private async applyRemoteChanges(
    changedPaths: string[],
    entries: PailEntries,
  ): Promise<void> {
    await applyRemoteChanges(changedPaths, entries, this.workspace, {
      blocks: this.blocks,
      current: this.current ?? undefined,
    });
  }


  /**
   * Mark the engine as stopped.
   */
  stop(): void {
    this.running = false;
  }

  /**
   * Pull all remote state and write to local filesystem.
   * Used by /storacha-join to overwrite local with remote before watcher starts.
   */
  async pullRemote(): Promise<number> {
    if (!this.name) throw new Error("Sync engine not initialized");

    try {
      const result = await Revision.resolve(this.blocks, this.name, {
        base: this.current ?? undefined,
      });
      await this.storeBlocks(result.additions);
      this.current = result.value;
    } catch (err) {
      if (!(err instanceof NoValueError)) throw err;
    }

    const entries = await this.getPailEntries();
    if (entries.size > 0) {
      const allPaths = [...entries.keys()];
      await applyRemoteChanges(allPaths, entries, this.workspace, {
        blocks: this.blocks,
        current: this.current ?? undefined,
      });
    }

    this.lastSync = Date.now();
    return entries.size;
  }

  /**
   * Inspect internal state for debugging.
   */
  async inspect(): Promise<{
    root: string | null;
    revisions: { event: string }[];
    pailKeys: string[];
    pendingOps: { type: string; key: string; value?: string }[];
    running: boolean;
  }> {
    const entries = await this.getPailEntries();
    return {
      root: this.current?.root?.toString() ?? null,
      revisions: this.current?.revision?.map((r) => ({
        event: r.event.cid.toString(),
      })) ?? [],
      pailKeys: [...entries.keys()],
      pendingOps: this.pendingOps.map((op) => ({
        type: op.type,
        key: op.key,
        value: op.value?.toString(),
      })),
      running: this.running,
    };
  }

  async status(): Promise<SyncState> {
    const entries = await this.getPailEntries();
    return {
      running: this.running,
      lastSync: this.lastSync,
      root: this.current?.root ?? null,
      entryCount: entries.size,
      pendingChanges: this.pendingOps.length,
    };
  }

  async exportNameArchive(): Promise<string> {
    if (!this.name) throw new Error("Sync engine not initialized");
    const bytes = await this.name.archive();
    return encodeDelegation(bytes);
  }

  private async storeBlocks(blocks: Block[]): Promise<void> {
    for (const block of blocks) {
      await this.blocks.put(block);
    }
  }
}
