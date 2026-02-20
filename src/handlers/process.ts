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
import type { FileChange, PailOp } from "../types/index.js";
import type { EncryptionConfig } from "@storacha/encrypt-upload-client/types";
import { encodeFiles } from "../utils/encoder.js";
import { encryptToBlockStream } from "../utils/crypto.js";
import * as mdsync from "../mdsync/index.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";

/** Callback to persist a block to the CAR file for upload. */
export type BlockSink = (block: Block) => Promise<void>;

/** Callback to persist a block to the local blockstore for future reads. */
export type BlockStore = (block: Block) => Promise<void>;

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
  store?: BlockStore,
  encryptionConfig?: EncryptionConfig,
  decrypt?: (cid: CID) => Promise<Uint8Array>,
): Promise<PailOp[]> {
  const pendingOps: PailOp[] = [];

  const mdChanges = changes.filter((c) => isMarkdown(c.path));
  const regularChanges = changes.filter((c) => !isMarkdown(c.path));

  // --- Regular files ---
  const toEncode = regularChanges
    .filter((c) => c.type !== "unlink")
    .map((c) => c.path);

  const files: { path: string; rootCID: UnknownLink }[] = [];

  if (encryptionConfig) {
    // Private space: encrypt each file
    for (const relPath of toEncode) {
      try {
        const fileBytes = await fs.readFile(path.join(workspace, relPath));
        const encStream = await encryptToBlockStream(
          new Blob([fileBytes as Uint8Array<ArrayBuffer>]),
          encryptionConfig,
        );
        const rootCID = await drainBlockStream(encStream, sink);
        files.push({ path: relPath, rootCID });
      } catch (err: any) {
        if (err.code === "ENOENT") {
          console.warn(`File not found during encoding: ${relPath}`);
          continue;
        }
        throw err;
      }
    }
  } else {
    // Public space: UnixFS encode
    const encoded = await encodeFiles(workspace, toEncode);
    for (const file of encoded) {
      const rootCID = await drainBlockStream(file.blocks as any, sink);
      files.push({ path: file.path, rootCID });
    }
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
    const block = current
      ? await mdsync.put(blocks, current, change.path, content, decrypt)
      : await mdsync.v0Put(content);
    if (!block) {
      continue; // No change detected, skip writing a new entry.
    }

    if (encryptionConfig) {
      // Private space: encrypt the single-block entry
      const encStream = await encryptToBlockStream(
        new Blob([block.bytes as Uint8Array<ArrayBuffer>]),
        encryptionConfig,
      );
      const rootCID = await drainBlockStream(encStream, sink);
      // Store unencrypted block locally for future resolveValue calls
      if (store) await store(block);
      pendingOps.push({
        type: "put",
        key: change.path,
        value: rootCID as CID,
      });
    } else {
      // Public space: store block directly
      await sink(block);
      if (store) await store(block);
      pendingOps.push({
        type: "put",
        key: change.path,
        value: block.cid as CID,
      });
    }
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
