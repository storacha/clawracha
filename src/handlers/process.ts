/**
 * Pure function to diff file changes against pail state and produce ops.
 *
 * Markdown files (.md) are handled via mdsync — CRDT merge rather than
 * whole-file UnixFS replacement. Regular files go through encodeFiles.
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
import * as mdsync from "../mdsync/index.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";

/** Callback to persist a block to the CAR file for upload. */
export type BlockSink = (block: Block) => Promise<void>;

/** Callback to persist a block to the local blockstore for future reads. */
export type BlockStore = (block: Block) => Promise<void>;

const isMarkdown = (filePath: string) => filePath.endsWith(".md");

export async function processChanges(
  changes: FileChange[],
  workspace: string,
  current: ValueView | null,
  blocks: BlockFetcher,
  sink: BlockSink,
  store?: BlockStore,
): Promise<PailOp[]> {
  const pendingOps: PailOp[] = [];

  const mdChanges = changes.filter((c) => isMarkdown(c.path));
  const regularChanges = changes.filter((c) => !isMarkdown(c.path));

  // --- Regular files (UnixFS encode) ---
  const toEncode = regularChanges
    .filter((c) => c.type !== "unlink")
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

  // --- Markdown files (CRDT merge via mdsync) ---
  const mdPuts = mdChanges.filter((c) => c.type !== "unlink");
  for (const change of mdPuts) {
    const content = await fs.readFile(
      path.join(workspace, change.path),
      "utf-8",
    );
    const newEntry = current
      ? await mdsync.put(blocks, current, change.path, content)
      : await mdsync.v0Put(content);
    if (!newEntry) {
      continue; // No change detected, skip writing a new entry.
    }
    const { mdEntryCid, additions } = newEntry;
    // Sink blocks to CAR for upload, and store locally for future resolveValue calls.
    for (const block of additions) {
      await sink(block);
      if (store) await store(block);
    }

    pendingOps.push({
      type: "put",
      key: change.path,
      value: mdEntryCid as CID,
    });
  }

  // --- Deletes (both regular and markdown) ---
  const toDelete = changes
    .filter((c) => c.type === "unlink")
    .map((c) => c.path);

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
