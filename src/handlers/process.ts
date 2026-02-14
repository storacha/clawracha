/**
 * Pure function to diff file changes against pail state and produce ops.
 */

import { CID } from "multiformats/cid";
import { Revision } from "@storacha/ucn/pail";
import type {
  BlockFetcher,
  UnknownLink,
  ValueView,
} from "@storacha/ucn/pail/api";
import type { Block } from "multiformats";
import type { FileChange, PailOp } from "../types/index.js";
import { encodeFiles } from "../utils/encoder.js";

/** Callback to persist a block (e.g. write it to a CAR file) */
export type BlockSink = (block: Block) => Promise<void>;

export async function processChanges(
  changes: FileChange[],
  workspace: string,
  current: ValueView | null,
  blocks: BlockFetcher,
  sink: BlockSink,
): Promise<PailOp[]> {
  const pendingOps: PailOp[] = [];

  const toEncode = changes
    .filter((c) => c.type !== "unlink")
    .map((c) => c.path);
  const toDelete = changes
    .filter((c) => c.type === "unlink")
    .map((c) => c.path);

  const encoded = await encodeFiles(workspace, toEncode);

  const files = [];
  for (const file of encoded) {
    let root: UnknownLink | null = null;
    const reader = file.blocks.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      root = value.cid;
      await sink(value as unknown as Block);
    }
    if (!root) {
      throw new Error(`Failed to encode file: ${file.path}`);
    }
    files.push({ path: file.path, rootCID: root as UnknownLink });
  }

  for (const file of files) {
    const existing = current
      ? await Revision.get(blocks, current, file.path)
      : null;
    if (!existing || !existing.equals(file.rootCID)) {
      pendingOps.push({
        type: "put",
        key: file.path,
        value: file.rootCID as CID,
      });
    }
  }

  for (const deletePath of toDelete) {
    const existing = current
      ? await Revision.get(blocks, current, deletePath)
      : null;
    if (existing) {
      pendingOps.push({ type: "del", key: deletePath });
    }
  }

  return pendingOps;
}
