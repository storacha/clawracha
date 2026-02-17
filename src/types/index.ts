/**
 * Type definitions for Storacha workspace sync
 */

import type { UnknownLink } from "multiformats";
import type { Block } from "multiformats";
import type { CID } from "multiformats/cid";

/** Plugin configuration (from openclaw.plugin.json schema) */
export interface SyncPluginConfig {
  enabled: boolean;
  watchPatterns: string[];
  ignorePatterns: string[];
}

/** Stored in .storacha/config.json — device-specific, not synced */
export interface DeviceConfig {
  /** Ed25519 agent private key (base64) */
  agentKey: string;
  /** UCN name archive (base64 CAR) */
  nameArchive?: string;
  /** Space → agent upload delegation (base64 archive) */
  uploadDelegation?: string;
  /** Name → agent delegation for pail sync (base64 archive) */
  nameDelegation?: string;
  /** Space DID extracted from upload delegation */
  spaceDID?: string;
  /** Whether setup is complete (watcher won't start without this) */
  setupComplete?: boolean;
}

/** Current sync state */
export interface SyncState {
  /** Is sync currently running? */
  running: boolean;
  /** Last successful sync timestamp */
  lastSync: number | null;
  /** Current pail root CID */
  root: UnknownLink | null;
  /** Number of tracked entries */
  entryCount: number;
  /** Pending local changes not yet pushed */
  pendingChanges: number;
}

/** File change event from watcher */
export interface FileChange {
  type: "add" | "change" | "unlink";
  path: string; // relative to workspace
}

/** Encoded file result */
export interface EncodedFile {
  path: string;
  blocks: ReadableStream<Block>;
  size: number;
}

/** Diff operation for pail */
export interface PailOp {
  type: "put" | "del";
  key: string; // file path
  value?: CID; // root CID for puts
}
