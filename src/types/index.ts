/**
 * Type definitions for Storacha workspace sync
 */

import type { UnknownLink } from "multiformats";
import type { Block } from "multiformats";
import type { CID } from "multiformats/cid";
import type {
  DecryptionConfig,
  EncryptionConfig,
} from "@storacha/encrypt-upload-client/types";

/** Gateway config shape — replaces OpenClawConfig["gateway"] for decoupling. */
export interface GatewayConfig {
  port?: number;
  auth?: { token?: string; password?: string };
}

/** Plugin configuration (from openclaw.plugin.json schema) */
export interface SyncPluginConfig {
  enabled: boolean;
  watchPatterns: string[];
  ignorePatterns: string[];
}

export interface PublicAccess {
  type: "public";
}

export interface PrivateAccess {
  type: "private";
  encryption: {
    provider: string;
    algorithm: string;
  };
}

export type SpaceAccess = PublicAccess | PrivateAccess;

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
  /** Plan/get delegation for KMS access in private spaces (base64 archive) */
  planDelegation?: string;
  /** Space DID extracted from upload delegation */
  spaceDID?: string;
  /** Space access type from Storacha's perspective (private = server-side KMS) */
  storachaAccess?: SpaceAccess;
  /** KMS provider — determines URL/DID at runtime */
  kmsProvider?: "google" | "1password";
  /** KMS location — 1Password account name (only for 1password provider) */
  kmsLocation?: string;
  /** KMS keyring — 1Password vault name (only for 1password provider) */
  kmsKeyring?: string;
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

/** Resolved KMS service endpoint. */
export interface KmsEndpoint {
  url: string;
  did: string;
}

/** Bundled encryption + decryption config for private spaces. */
export interface CryptoConfig {
  encryptionConfig: EncryptionConfig;
  decryptionConfig: DecryptionConfig;
  kmsEndpoint: KmsEndpoint;
}

/** Minimal storage client interface (subset of @storacha/client used by SyncEngine). */
export interface StorageClient {
  uploadCAR(car: import("@storacha/upload-client/types").BlobLike): Promise<unknown>;
}

export type Encoder = (file: Blob) => Promise<ReadableStream<Block>>;

export type ContentFetcher = (cid: CID) => Promise<Uint8Array>;

/** Diff operation for pail */
export interface PailOp {
  type: "put" | "del";
  key: string; // file path
  value?: CID; // root CID for puts
}
