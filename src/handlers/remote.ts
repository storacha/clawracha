/**
 * Apply remote changes to local filesystem.
 *
 * Regular files are fetched from the IPFS gateway (handles UnixFS reassembly).
 * For private spaces, regular files are decrypted via EncryptedClient.
 * Markdown files (.md) are resolved via mdsync CRDT merge — the tiered
 * blockstore's gateway layer handles fetching any missing blocks.
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import type { CID } from "multiformats/cid";
import type { BlockFetcher, ValueView } from "@storacha/ucn/pail/api";
import type {
  DecryptionConfig,
  EncryptedClient,
} from "@storacha/encrypt-upload-client/types";
import * as mdsync from "../mdsync/index.js";
import { makeDecryptFn } from "../utils/crypto.js";
import type { Signer } from "@ucanto/interface";
const DEFAULT_GATEWAY = "https://storacha.link";

const isMarkdown = (filePath: string) => filePath.endsWith(".md");

/** Drain a ReadableStream into a single Uint8Array. */
async function drainStream(stream: ReadableStream): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

export async function applyRemoteChanges(
  changedPaths: string[],
  entries: Map<string, CID>,
  workspace: string,
  options?: {
    gateway?: string;
    blocks?: BlockFetcher;
    current?: ValueView;
    encryptedClient?: EncryptedClient;
    decryptionConfig?: DecryptionConfig;
    agent?: Signer;
  },
): Promise<void> {
  const gateway = options?.gateway ?? DEFAULT_GATEWAY;
  const isEncrypted = !!(options?.encryptedClient && options?.decryptionConfig);

  for (const relativePath of changedPaths) {
    const cid = entries.get(relativePath);
    const fullPath = path.join(workspace, relativePath);

    if (!cid) {
      // Deleted remotely
      try {
        await fs.unlink(fullPath);
      } catch (err: any) {
        if (err.code !== "ENOENT") throw err;
      }
    } else if (
      isMarkdown(relativePath) &&
      options?.blocks &&
      options?.current
    ) {
      // Markdown: resolve via mdsync CRDT merge.
      // For single-device, unencrypted blocks are stored locally.
      // TODO: For multi-device private spaces, add decrypt layer to resolveValue.
      const decrypt = isEncrypted
        ? makeDecryptFn(
            options!.encryptedClient!,
            options!.decryptionConfig!,
            options!.agent!,
          )
        : undefined;
      const content = await mdsync.get(
        options.blocks,
        options.current,
        relativePath,
        decrypt,
      );
      if (content != null) {
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, content);
      }
    } else if (isEncrypted) {
      // Private space: retrieve and decrypt via EncryptedClient
      const { stream } = await options!.encryptedClient!.retrieveAndDecryptFile(
        cid,
        options!.decryptionConfig!,
      );
      const bytes = await drainStream(stream);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, bytes);
    } else {
      // Public space: fetch full file from gateway (handles UnixFS reassembly)
      const res = await fetch(`${gateway}/ipfs/${cid}`);
      if (!res.ok) {
        throw new Error(`Gateway fetch failed for ${cid}: ${res.status}`);
      }
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, new Uint8Array(await res.arrayBuffer()));
    }
  }
}
