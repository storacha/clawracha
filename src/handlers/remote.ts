/**
 * Apply remote changes to local filesystem.
 *
 * Regular files are fetched from the IPFS gateway (handles UnixFS reassembly).
 * Markdown files (.md) are resolved via mdsync CRDT merge — the tiered
 * blockstore's gateway layer handles fetching any missing blocks.
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import type { CID } from "multiformats/cid";
import type { BlockFetcher, ValueView } from "@storacha/ucn/pail/api";
import * as mdsync from "../mdsync/index.js";

const DEFAULT_GATEWAY = "https://storacha.link";

const isMarkdown = (filePath: string) => filePath.endsWith(".md");

export async function applyRemoteChanges(
  changedPaths: string[],
  entries: Map<string, CID>,
  workspace: string,
  options?: {
    gateway?: string;
    blocks?: BlockFetcher;
    current?: ValueView;
  },
): Promise<void> {
  const gateway = options?.gateway ?? DEFAULT_GATEWAY;

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
    } else if (isMarkdown(relativePath) && options?.blocks && options?.current) {
      // Markdown: resolve via mdsync CRDT merge.
      // The blockstore's lowest tier is a gateway fetcher, so any blocks
      // we don't have locally will be fetched transparently.
      const content = await mdsync.get(options.blocks, options.current, relativePath);
      if (content != null) {
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, content);
      }
    } else {
      // Regular file: fetch full file from gateway (handles UnixFS reassembly)
      const res = await fetch(`${gateway}/ipfs/${cid}`);
      if (!res.ok) {
        throw new Error(`Gateway fetch failed for ${cid}: ${res.status}`);
      }
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, new Uint8Array(await res.arrayBuffer()));
    }
  }
}
