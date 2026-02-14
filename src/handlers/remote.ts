/**
 * Apply remote changes to local filesystem by fetching files from IPFS gateway.
 *
 * The gateway handles block assembly — requesting a CID without ?format=raw
 * returns the full deserialized file per the IPFS Path Gateway spec.
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import type { CID } from "multiformats/cid";

const DEFAULT_GATEWAY = "https://storacha.link";

export async function applyRemoteChanges(
  changedPaths: string[],
  entries: Map<string, CID>,
  workspace: string,
  options?: { gateway?: string },
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
    } else {
      // Fetch full file from gateway (handles UnixFS reassembly)
      const res = await fetch(`${gateway}/ipfs/${cid}`);
      if (!res.ok) {
        throw new Error(`Gateway fetch failed for ${cid}: ${res.status}`);
      }
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, new Uint8Array(await res.arrayBuffer()));
    }
  }
}
