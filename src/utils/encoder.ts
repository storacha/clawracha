/**
 * File encoder - converts files to UnixFS DAG with root CID
 *
 * Uses @storacha/upload-client's UnixFS encoding to generate
 * content-addressed blocks for each file.
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as stream from "node:stream";
import { createFileEncoderStream } from "@storacha/upload-client/unixfs";
import type { EncodedFile } from "../types/index.js";

/**
 * Encode a single file to UnixFS blocks
 */
export async function encodeWorkspaceFile(
  workspacePath: string,
  relativePath: string,
): Promise<EncodedFile> {
  const fullPath = path.join(workspacePath, relativePath);
  const fileHandle = await fs.open(fullPath);
  const stat = await fs.stat(fullPath);

  // Encode to UnixFS - returns { cid, blocks }
  const blocks = createFileEncoderStream({
    // @ts-expect-error node web stream not type compatible with web stream
    stream() {
      return stream.Readable.toWeb(fileHandle.createReadStream());
    },
  });

  return {
    path: relativePath,
    size: stat.size,
    blocks: blocks as any,
  };
}

/**
 * Encode multiple files, returning all encoded results
 */
export async function encodeFiles(
  workspacePath: string,
  relativePaths: string[],
): Promise<EncodedFile[]> {
  const results: EncodedFile[] = [];

  for (const relativePath of relativePaths) {
    try {
      const encoded = await encodeWorkspaceFile(workspacePath, relativePath);
      results.push(encoded);
    } catch (err: any) {
      if (err.code === "ENOENT") {
        // File was deleted between detection and encoding - skip
        console.warn(`File not found during encoding: ${relativePath}`);
        continue;
      }
      throw err;
    }
  }

  return results;
}
