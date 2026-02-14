/**
 * Pre-configured blockstore for workspace sync:
 * Memory (LRU) → Disk → Gateway, with cache promotion.
 */

import {
  LRUBlockstore,
  GatewayBlockFetcher,
  TieredBlockFetcher,
  withCache,
} from "@storacha/ucn/block";
import { DiskBlockstore } from "./disk.js";
import type { Block } from "multiformats";

export interface WorkspaceBlockstore {
  get: TieredBlockFetcher["get"];
  put: (block: Block) => Promise<void>;
}

export function createWorkspaceBlockstore(
  workspacePath: string,
  options?: { gateway?: string; lruMax?: number }
): WorkspaceBlockstore {
  const memory = new LRUBlockstore(options?.lruMax ?? 1024);
  const disk = new DiskBlockstore(workspacePath);
  const gateway = new GatewayBlockFetcher(options?.gateway);

  // Reads: memory → disk → gateway, with cache promotion to memory
  const fetcher = withCache(
    new TieredBlockFetcher(memory, disk, gateway),
    memory
  );

  return {
    get: fetcher.get.bind(fetcher),
    async put(block: Block) {
      await memory.put(block);
      await disk.put(block);
    },
  };
}
