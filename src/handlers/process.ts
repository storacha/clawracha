/**
 * Pure function to diff file changes against pail state and produce ops.
 *
 * Markdown files (.md) are handled via mdsync — CRDT merge rather than
 * whole-file UnixFS replacement. Regular files go through encodeFiles.
 *
 * When encryptionConfig is provided (private spaces), content is encrypted
 * before upload via encryptToBlockStream.
 */

import { CID } from "multiformats/cid";
import { Revision } from "@storacha/ucn/pail";
import type {
  BlockFetcher,
  UnknownLink,
  ValueView,
} from "@storacha/ucn/pail/api";
import type { Block } from "multiformats";
import type {
  ContentFetcher,
  Encoder,
  FileChange,
  PailOp,
} from "../types/index.js";
import * as mdsync from "../mdsync/index.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";

/** Callback to persist a block (CAR file, local blockstore, etc). */
export type BlockSink = (block: Block) => Promise<void>;

const isMarkdown = (filePath: string) => filePath.endsWith(".md");

/** Read all blocks from a ReadableStream, sinking each, return the last CID (root). */
async function drainBlockStream(
  stream: ReadableStream<Block>,
  sink: BlockSink,
): Promise<UnknownLink> {
  const reader = stream.getReader();
  let root: UnknownLink | null = null;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    root = value.cid;
    await sink(value as unknown as Block);
  }
  if (!root) throw new Error("Empty block stream");
  return root;
}

export async function processChanges(
  changes: FileChange[],
  workspace: string,
  current: ValueView | null,
  blocks: BlockFetcher,
  sink: BlockSink,
  encoder: Encoder,
  contentFetcher: ContentFetcher,
): Promise<PailOp[]> {
  const pendingOps: PailOp[] = [];

  const mdChanges = changes.filter((c) => isMarkdown(c.path));
  const regularChanges = changes.filter((c) => !isMarkdown(c.path));

  // --- Regular files ---
  const toEncode = regularChanges
    .filter((c) => c.type !== "unlink")
    .map((c) => c.path);

  for (const relPath of toEncode) {
    try {
      const fileBytes = await fs.readFile(path.join(workspace, relPath));
      const existing = current
        ? await Revision.get(blocks, current, relPath)
        : null;
      if (existing) {
        const existingBytes = await contentFetcher(existing as CID);
        if (Buffer.compare(existingBytes, fileBytes) === 0) {
          continue; // No change detected, skip encoding/uploading.
        }
      }
      const encStream = await encoder(
        new Blob([fileBytes as Uint8Array<ArrayBuffer>]),
      );
      const rootCID = await drainBlockStream(encStream, sink);
      pendingOps.push({
        type: "put",
        key: relPath,
        value: rootCID as CID,
      });
    } catch (err: any) {
      if (err.code === "ENOENT") {
        console.warn(`File not found during encoding: ${relPath}`);
        continue;
      }
      throw err;
    }
  }

  // --- Markdown files (CRDT merge via mdsync) ---
  const mdPuts = mdChanges.filter((c) => c.type !== "unlink");
  for (const change of mdPuts) {
    const content = await fs.readFile(
      path.join(workspace, change.path),
      "utf-8",
    );
    const block = current
      ? await mdsync.put(blocks, contentFetcher, current, change.path, content)
      : await mdsync.v0Put(content);
    if (!block) {
      continue; // No change detected, skip writing a new entry.
    }

    const encStream = await encoder(
      new Blob([block.bytes as Uint8Array<ArrayBuffer>]),
    );
    const rootCID = await drainBlockStream(encStream, sink);
    pendingOps.push({
      type: "put",
      key: change.path,
      value: rootCID as CID,
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
