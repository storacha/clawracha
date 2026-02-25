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
import * as mdsync from "../mdsync/index.js";

const isMarkdown = (filePath: string) => filePath.endsWith(".md");

export async function applyRemoteChanges(
  changedPaths: string[],
  entries: Map<string, CID>,
  workspace: string,
  contentFetcher: (cid: CID) => Promise<Uint8Array>,
  options?: {
    blocks?: BlockFetcher;
    current?: ValueView;
  },
): Promise<void> {
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
      const content = await mdsync.get(
        options.blocks,
        contentFetcher,
        options.current,
        relativePath,
      );
      if (content != null) {
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, content);
      }
    } else {
      const bytes = await contentFetcher(cid);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, bytes);
    }
  }
}
