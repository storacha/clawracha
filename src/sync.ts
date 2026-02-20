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
import { createStorachaClient } from "./utils/client.js";
import { decodeDelegation, encodeDelegation } from "./utils/delegation.js";
import { extract } from "@storacha/client/delegation";
import type { EncryptionConfig, DecryptionConfig, EncryptedClient } from "@storacha/encrypt-upload-client/types";
import { makeEncryptionConfig, makeDecryptionConfig, getEncryptedClient } from "./utils/crypto.js";

/** Engine is either stopped or running with a name and client. */
type State =
  | { initialized: false; running: false }
  | { initialized: true; running: true; name: NameView; storachaClient: Client }
  | {
      initialized: true;
      running: false;
      name: NameView;
      storachaClient: Client;
    };
export class SyncEngine {
  private workspace: string;
  private blocks: WorkspaceBlockstore;
  private state: State = { initialized: false, running: false };
  private current: ValueView | null = null;
  private pendingOps: PailOp[] = [];
  private carFile: WritableCar | null = null;
  private lastSync: number | null = null;
  private syncLock: Promise<void> = Promise.resolve();
  private encryptionConfig?: EncryptionConfig;
  private decryptionConfig?: DecryptionConfig;
  private encryptedClient?: EncryptedClient;

  constructor(workspace: string) {
    this.workspace = workspace;
    this.blocks = createWorkspaceBlockstore(workspace);
  }

  /**
   * Initialize sync engine with device config.
   * Creates the Storacha client and resolves the UCN name.
   */
  async init(config: DeviceConfig): Promise<void> {
    const storachaClient = await createStorachaClient(config);
    const agent = Agent.parse(config.agentKey);

    let name: NameView;
    if (config.nameArchive) {
      // Restore from previously saved archive (has full state)
      const archiveBytes = decodeDelegation(config.nameArchive);
      name = await Name.extract(agent, archiveBytes);
    } else if (config.nameDelegation) {
      // Reconstruct from delegation (granted by another device)
      const nameBytes = decodeDelegation(config.nameDelegation);
      const { ok: delegation } = await extract(nameBytes);
      if (!delegation) throw new Error("Failed to extract name delegation");
      name = Name.from(agent, [delegation]);
    } else {
      // First device — create a new name
      name = await Name.create(agent);
    }

    this.state = { initialized: true, running: true, name, storachaClient };

    // Set up encryption for private spaces
    if (config.access?.type === "private") {
      if (!config.planDelegation) {
        throw new Error("Private space requires a plan delegation for KMS access");
      }
      const planBytes = decodeDelegation(config.planDelegation);
      const { ok: planDel } = await extract(planBytes);
      if (!planDel) throw new Error("Failed to extract plan delegation");

      this.encryptionConfig = makeEncryptionConfig(
        agent,
        config.spaceDID as `did:key:${string}`,
        [planDel],
      );

      // For decrypt, uploadDelegation covers space/content/decrypt
      const uploadBytes = decodeDelegation(config.uploadDelegation!);
      const { ok: uploadDel } = await extract(uploadBytes);
      if (!uploadDel) throw new Error("Failed to extract upload delegation");
      this.decryptionConfig = makeDecryptionConfig(
        config.spaceDID as `did:key:${string}`,
        uploadDel,
      );
      this.encryptedClient = await getEncryptedClient(storachaClient);
    }

    try {
      const result = await Revision.resolve(this.blocks, name);
      this.current = result.value;
      await this.storeBlocks(result.additions);
    } catch (err) {
      if (err instanceof NoValueError) {
        this.current = null;
      } else {
        throw err;
      }
    }
  }

  /**
   * Require running state or throw.
   */
  private requireRunning(): { name: NameView; storachaClient: Client } {
    if (!this.state.running) {
      throw new Error("Sync engine not running");
    }
    return this.state;
  }

  /**
   * Require state is initialized or throw.
   */
  private requireInitialized(): { name: NameView; storachaClient: Client } {
    if (!this.state.initialized) {
      throw new Error("Sync engine not initialized");
    }
    return this.state;
  }

  /**
   * Process a batch of file changes.
   * Can be called even when not running (accumulates pending ops).
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
      this.encryptionConfig,
    );
    this.pendingOps.push(...pendingOps);
  }

  /**
   * Execute sync: generate revision, publish, upload, apply remote changes.
   */
  async sync(): Promise<void> {
    const op = this.syncLock.then(() => this._syncInner());
    this.syncLock = op.catch(() => {}); // heal chain so subsequent syncs run
    return op;
  }

  private async _syncInner(): Promise<void> {
    const { name } = this.requireRunning();
    const beforeEntries = await this.getPailEntries();

    if (this.pendingOps.length === 0) {
      // No pending ops — just pull remote
      try {
        const result = await Revision.resolve(this.blocks, name, {
          base: this.current ?? undefined,
        });
        await this.storeBlocks(result.additions);
        this.current = result.value;
      } catch (err) {
        if (!(err instanceof NoValueError)) throw err;
      }
    } else {
      let pendingOps = [...this.pendingOps];
      this.pendingOps = [];
      try {
        while (pendingOps.length > 0) {
          if (!this.carFile) {
            throw new Error("CAR file not initialized");
          }
          const { current, revisionBlocks, event, remainingOps } =
            await applyPendingOps(this.blocks, name, this.current, pendingOps);
          this.current = current;
          for (const block of revisionBlocks) {
            await this.carFile.put(block);
          }
          await this.storeBlocks(revisionBlocks);
          if (event) {
            await this.carFile.put(event);
            await this.storeBlocks([event]);
          }
          pendingOps = remainingOps;
          await this.possiblyUploadCAR();
          if (pendingOps.length > 0) {
            this.carFile = await makeTempCar();
          }
        }
      } catch (err) {
        this.pendingOps.unshift(...pendingOps);
        throw err;
      }
    }

    // Apply remote changes
    const afterEntries = await this.getPailEntries();
    const remoteChanges = diffRemoteChanges(beforeEntries, afterEntries);
    if (remoteChanges.length > 0) {
      await this.applyRemoteChanges(remoteChanges, afterEntries);
    }

    this.lastSync = Date.now();
  }

  /**
   * Create CAR and upload to Storacha.
   */
  private async possiblyUploadCAR(): Promise<void> {
    if (this.carFile) {
      const { storachaClient } = this.requireRunning();
      const readableCar = await this.carFile.switchToReadable();
      this.carFile = null;
      if (readableCar) {
        try {
          await storachaClient.uploadCAR(readableCar.readable);
        } finally {
          await readableCar.cleanup();
        }
      }
    }
  }

  /**
   * Get current pail entries as map.
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
   * Apply remote changes to local filesystem.
   */
  private async applyRemoteChanges(
    changedPaths: string[],
    entries: PailEntries,
  ): Promise<void> {
    await applyRemoteChanges(changedPaths, entries, this.workspace, {
      blocks: this.blocks,
      current: this.current ?? undefined,
      encryptedClient: this.encryptedClient,
      decryptionConfig: this.decryptionConfig,
    });
  }

  /**
   * Mark the engine as stopped.
   */
  async stop(): Promise<void> {
    this.syncLock = this.syncLock.then(() => {
      this.state = this.state.initialized
        ? {
            initialized: true,
            running: false,
            name: this.state.name,
            storachaClient: this.state.storachaClient,
          }
        : { initialized: false, running: false };
    });
    return this.syncLock;
  }

  /**
   * Pull all remote state and write to local filesystem.
   * Used by join to overwrite local with remote before watcher starts.
   */
  async pullRemote(): Promise<number> {
    const op = this.syncLock.then(() => this._pullRemoteInner());
    this.syncLock = op.then(() => void 0).catch(() => {}); // heal chain so subsequent syncs run
    return op;
  }

  private async _pullRemoteInner(): Promise<number> {
    const { name } = this.requireRunning();

    try {
      const result = await Revision.resolve(this.blocks, name, {
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
        encryptedClient: this.encryptedClient,
        decryptionConfig: this.decryptionConfig,
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
      revisions:
        this.current?.revision?.map((r) => ({
          event: r.event.cid.toString(),
        })) ?? [],
      pailKeys: [...entries.keys()],
      pendingOps: this.pendingOps.map((op) => ({
        type: op.type,
        key: op.key,
        value: op.value?.toString(),
      })),
      running: this.state.running,
    };
  }

  async status(): Promise<SyncState> {
    const entries = await this.getPailEntries();
    return {
      running: this.state.running,
      lastSync: this.lastSync,
      root: this.current?.root ?? null,
      entryCount: entries.size,
      pendingChanges: this.pendingOps.length,
    };
  }

  async exportNameArchive(): Promise<string> {
    const { name } = this.requireInitialized();
    const bytes = await name.archive();
    return encodeDelegation(bytes);
  }

  private async storeBlocks(blocks: Block[]): Promise<void> {
    for (const block of blocks) {
      await this.blocks.put(block);
    }
  }
}
