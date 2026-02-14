/**
 * Differ - compares local directory tree with pail entries
 *
 * Generates put/del operations to sync local state to pail.
 */

import type { CID } from "multiformats/cid";
import type { PailOp } from "../types/index.js";

/** Map of path → CID from pail entries */
export type PailEntries = Map<string, CID>;

/** Map of path → CID from local encoded files */
export type LocalEntries = Map<string, CID>;

/**
 * Compute diff between local files and pail entries
 *
 * @param local - Encoded local files (path → rootCID)
 * @param pail - Current pail entries (path → CID)
 * @returns Operations to apply to pail
 */
export function diffEntries(local: LocalEntries, pail: PailEntries): PailOp[] {
  const ops: PailOp[] = [];

  // Find puts: files in local that are new or changed
  for (const [path, localCID] of local) {
    const pailCID = pail.get(path);
    if (!pailCID || !localCID.equals(pailCID)) {
      ops.push({ type: "put", key: path, value: localCID });
    }
  }

  // Find deletes: files in pail that aren't in local
  for (const path of pail.keys()) {
    if (!local.has(path)) {
      ops.push({ type: "del", key: path });
    }
  }

  return ops;
}


/**
 * Diff two pail states to find files that changed remotely
 * (Used after publish to determine what to download)
 *
 * @param before - Pail entries before publish
 * @param after - Pail entries after publish (may include remote changes)
 * @returns Paths that changed remotely (need to download)
 */
export function diffRemoteChanges(
  before: PailEntries,
  after: PailEntries
): string[] {
  const changed: string[] = [];

  for (const [path, afterCID] of after) {
    const beforeCID = before.get(path);
    if (!beforeCID || !afterCID.equals(beforeCID)) {
      changed.push(path);
    }
  }

  return changed;
}
