/**
 * Delegation encoding/decoding utilities.
 *
 * Delegations are serialized as CIDv1 with the CAR codec (0x0202)
 * and identity multihash, encoded as base64. This matches the format
 * used by the Storacha CLI (`storacha delegation create --base64`).
 */

import { CID } from "multiformats/cid";
import { base64 } from "multiformats/bases/base64";
import { identity } from "multiformats/hashes/identity";

/** CAR codec code (multicodec 0x0202) */
const CAR_CODE = 0x0202;

/**
 * Encode delegation archive bytes as a CID string (base64).
 * archive bytes → CIDv1(CAR, identity) → base64 string
 */
export function encodeDelegation(archiveBytes: Uint8Array): string {
  const cid = CID.createV1(CAR_CODE, identity.digest(archiveBytes));
  return cid.toString(base64);
}

/**
 * Decode a delegation CID string back to archive bytes.
 * base64 string → CID → identity multihash digest → bytes
 */
export function decodeDelegation(encoded: string): Uint8Array {
  const cid = CID.parse(encoded, base64);
  if (cid.multihash.code !== identity.code) {
    throw new Error(
      "Invalid delegation encoding: expected identity multihash"
    );
  }
  return cid.multihash.digest;
}
