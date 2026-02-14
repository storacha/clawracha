/**
 * @storacha/clawracha - OpenClaw plugin for Storacha workspace sync
 */

export * from "./types/index.js";
export * from "./blockstore/index.js";
export { encodeWorkspaceFile, encodeFiles } from "./utils/encoder.js";
export { diffEntries, diffRemoteChanges } from "./utils/differ.js";
export { SyncEngine } from "./sync.js";
export { FileWatcher } from "./watcher.js";

// Re-export plugin definition (default export)
export { default as plugin } from "./plugin.js";
