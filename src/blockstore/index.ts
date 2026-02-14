/**
 * Blockstore layer — thin wrapper around @storacha/ucn/block
 *
 * UCN provides: MemoryBlockstore, LRUBlockstore, GatewayBlockFetcher,
 * TieredBlockFetcher, withCache.
 *
 * We add: DiskBlockstore (filesystem persistence) and a pre-configured
 * tiered setup for workspace sync.
 */

export {
  MemoryBlockstore,
  LRUBlockstore,
  GatewayBlockFetcher,
  TieredBlockFetcher,
  withCache,
} from "@storacha/ucn/block";

export { DiskBlockstore } from "./disk.js";
export {
  createWorkspaceBlockstore,
  type WorkspaceBlockstore,
} from "./workspace.js";
