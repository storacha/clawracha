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
import { NoValueError, Revision } from "@storacha/ucn/pail";
import type { NameView, ValueView } from "@storacha/ucn/pail/api";

import type {
  SyncState,
  FileChange,
  PailOp,
  DeviceConfig,
  ContentFetcher,
  Encoder,
  StorageClient,
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
import type { Client } from "@storacha/client";
import {
  createStorachaClient,
  resolveNameFromConfig,
  resolveCryptoConfig,
} from "./utils/config.js";
import { encodeDelegation } from "./utils/delegation.js";
import { publish } from "@storacha/ucn/pail/revision";
import { makeEncoder } from "./utils/encoder.js";
import { makeContentFetcher } from "./utils/contentfetcher.js";
import { Agent } from "@storacha/ucn/pail";

/** Engine is either stopped or running with a name and client. */
type State = { running: false } | { running: true };

export interface SyncDeps {
  blocks: WorkspaceBlockstore;
  name: NameView;
  client: StorageClient;
  encoder: Encoder;
  contentFetcher: ContentFetcher;
}
export class SyncEngine {
  private workspace: string;
  private blocks: WorkspaceBlockstore;
  private state: State = { running: false };
  private current: ValueView | null = null;
  private pendingOps: PailOp[] = [];
  private carFile: WritableCar | null = null;
  private lastSync: number | null = null;
  private syncLock: Promise<void> = Promise.resolve();
  private client: StorageClient;
  private name: NameView;
  private encoder: Encoder;
  private contentFetcher: ContentFetcher;
  constructor(workspace: string, deps: SyncDeps) {
    this.workspace = workspace;
    this.blocks = deps.blocks;
    this.client = deps.client;
    this.name = deps.name;
    this.encoder = deps.encoder;
    this.contentFetcher = deps.contentFetcher;
  }

  async start(): Promise<void> {
    this.state = { running: true };
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
  }

  /**
   * Initialize sync engine with device config.
   * Creates the Storacha client and resolves the UCN name.
   */
  static async fromConfig(
    workspace: string,
    config: DeviceConfig,
  ): Promise<SyncEngine> {
    const blocks = createWorkspaceBlockstore(workspace);
    const client = await createStorachaClient(config);
    const name = await resolveNameFromConfig(config);

    // Set up encryption for private spaces
    const crypto = await resolveCryptoConfig(config);

    const encoder = makeEncoder(crypto);
    const agent = Agent.parse(config.agentKey);
    const contentFetcher = makeContentFetcher(crypto, blocks, client, agent);
    return new SyncEngine(workspace, {
      blocks,
      name,
      client,
      encoder,
      contentFetcher,
    });
  }

  /**
   * Require running state or throw.
   */
  private requireRunning() {
    if (!this.state.running) {
      throw new Error("Sync engine not running");
    }
    return;
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
      async (block) => {
        await this.storeForUpload([block]);
      },
      this.encoder,
      this.contentFetcher,
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
    this.requireRunning();
    const beforeEntries = await this.getPailEntries();

    if (this.pendingOps.length === 0) {
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
    } else {
      let pendingOps = [...this.pendingOps];
      this.pendingOps = [];
      try {
        while (pendingOps.length > 0) {
          if (!this.carFile) {
            this.carFile = await makeTempCar();
          }
          const { revision, additions, remainingOps } = await applyPendingOps(
            this.blocks,
            this.current,
            pendingOps,
          );

          await this.storeForUpload(additions);
          await this.storeForUpload([revision.event]);
          await this.possiblyUploadCAR();
          const { value, additions: publishAdditions } = await publish(
            this.blocks,
            this.name,
            revision,
          );
          pendingOps = remainingOps;
          this.current = value;
          // save the next round of additions to CAR so they're ready to go if there are more pending ops, otherwise we would have to wait until the next sync call to upload them
          if (publishAdditions.length > 0) {
            this.carFile = await makeTempCar();
            await this.storeForUpload(publishAdditions);
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
      await applyRemoteChanges(
        remoteChanges,
        afterEntries,
        this.workspace,
        this.contentFetcher,
        {
          blocks: this.blocks,
          current: this.current ?? undefined,
        },
      );
    }

    this.lastSync = Date.now();
  }

  /**
   * Create CAR and upload to Storacha.
   */
  private async possiblyUploadCAR(): Promise<void> {
    if (this.carFile) {
      this.requireRunning();
      const readableCar = await this.carFile.switchToReadable();
      this.carFile = null;
      if (readableCar) {
        try {
          await this.client.uploadCAR(readableCar.readable);
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
   * Mark the engine as stopped.
   */
  async stop(): Promise<void> {
    this.syncLock = this.syncLock.then(() => {
      this.state = { running: false };
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
    this.requireRunning();
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
      await applyRemoteChanges(
        allPaths,
        entries,
        this.workspace,
        this.contentFetcher,
        {
          blocks: this.blocks,
          current: this.current ?? undefined,
        },
      );
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
    const bytes = await this.name.archive();
    return encodeDelegation(bytes);
  }

  private async storeBlocks(blocks: Block[]): Promise<void> {
    for (const block of blocks) {
      await this.blocks.put(block);
    }
  }

  private async storeForUpload(blocks: Block[]): Promise<void> {
    await this.carFile!.put(blocks);
    await this.storeBlocks(blocks);
  }
}
