/**
 * Pure function to apply pending pail operations (puts/dels) and publish.
 *
 * Cycle: operation → publish → return value.
 * Bootstraps with v0Put when no current value exists.
 */

import { Revision } from "@storacha/ucn/pail";
import * as Batch from "@storacha/ucn/pail/batch";
import type {
  ClockConnection,
  NameView,
  ValueView,
} from "@storacha/ucn/pail/api";
import type { Block } from "multiformats";
import { MemoryBlockstore, withCache } from "@storacha/ucn/block";

import type { PailOp } from "../types/index.js";
import type { WorkspaceBlockstore } from "../blockstore/index.js";

export interface ApplyResult {
  current: ValueView | null;
  revisionBlocks: Block[];
}

export async function applyPendingOps(
  blocks: WorkspaceBlockstore,
  name: NameView,
  current: ValueView | null,
  pendingOps: PailOp[],
  options?: { remotes?: ClockConnection[] },
): Promise<ApplyResult> {
  const revisionBlocks: Block[] = [];
  let ops = [...pendingOps];

  // Local cache so each step can read blocks produced by previous steps
  const cache = new MemoryBlockstore();
  const fetcher = withCache(blocks, cache);

  const accumulate = (additions: Block[]) => {
    for (const block of additions) {
      cache.put(block);
    }
    revisionBlocks.push(...additions);
  };

  if (!current) {
    const firstPut = ops.find((op) => op.type === "put" && op.value);
    if (firstPut?.value) {
      const result = await Revision.v0Put(fetcher, firstPut.key, firstPut.value);
      accumulate(result.additions);

      const pubResult = await Revision.publish(fetcher, name, result.revision, { remotes: options?.remotes });
      accumulate(pubResult.additions);
      current = pubResult.value;

      ops = ops.filter((op) => op !== firstPut);
    }
  }

  if (ops.length > 0 && current) {
    const batcher = await Batch.create(fetcher, current);
    for (const op of ops) {
      if (op.type === "put" && op.value) {
        await batcher.put(op.key, op.value);
      } else if (op.type === "del") {
        await batcher.del(op.key);
      }
    }
    const result = await batcher.commit();
    accumulate(result.additions);

    const pubResult = await Revision.publish(fetcher, name, result.revision, { remotes: options?.remotes });
    accumulate(pubResult.additions);
    current = pubResult.value;
  }

  return { current, revisionBlocks };
}
