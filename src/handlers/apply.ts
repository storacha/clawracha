/**
 * Pure function to apply pending pail operations (puts/dels) and publish.
 *
 * Cycle: operation → publish → return value.
 * Bootstraps with v0Put when no current value exists.
 */

import { Revision } from "@storacha/ucn/pail";
import * as Batch from "@storacha/ucn/pail/batch";
import type {
  ValueView,
  RevisionResult,
  BlockFetcher,
} from "@storacha/ucn/pail/api";
import type { PailOp } from "../types/index.js";

export async function applyPendingOps(
  blocks: BlockFetcher,
  current: ValueView | null,
  pendingOps: PailOp[],
): Promise<RevisionResult & { remainingOps: PailOp[] }> {
  let ops = [...pendingOps];

  if (!current) {
    const firstPut = ops.find((op) => op.type === "put" && op.value);
    if (firstPut?.value) {
      const result = await Revision.v0Put(blocks, firstPut.key, firstPut.value);

      return {
        ...result,
        remainingOps: ops.filter((op) => op !== firstPut),
      };
    }
    throw new Error("No current value or pending puts to initialize with");
  }
  const batcher = await Batch.create(blocks, current);
  for (const op of ops) {
    if (op.type === "put" && op.value) {
      await batcher.put(op.key, op.value);
    } else if (op.type === "del") {
      await batcher.del(op.key);
    }
  }
  const result = await batcher.commit();
  return {
    ...result,
    remainingOps: [], // All ops were included in the batch, so none remain
  };
}
