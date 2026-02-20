/**
 * Delegation bundle — packs upload, name, and plan delegations
 * into a single CAR file for the `join` workflow.
 */

import * as cbor from "@ipld/dag-cbor";
import { encode, decode } from "multiformats/block";
import { sha256 } from "multiformats/hashes/sha2";
import { CarWriter } from "@ipld/car/writer";
import { CarReader } from "@ipld/car/reader";

export interface DelegationBundle {
  upload: Uint8Array;
  name: Uint8Array;
  plan: Uint8Array;
  access?: { type: string; encryption?: { provider: string; algorithm: string } };
}

/**
 * Pack three delegation archives into a single CAR file.
 * Root block is DAG-CBOR: { upload, name, plan } as byte arrays.
 */
export async function createDelegationBundle(
  bundle: DelegationBundle,
): Promise<Uint8Array> {
  const rootBlock = await encode({
    value: bundle,
    codec: cbor,
    hasher: sha256,
  });

  const { writer, out } = CarWriter.create([rootBlock.cid]);
  const chunks: Uint8Array[] = [];
  const drain = (async () => {
    for await (const chunk of out) {
      chunks.push(chunk);
    }
  })();
  await writer.put(rootBlock);
  await writer.close();
  await drain;

  // Concatenate chunks
  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

/**
 * Extract three delegation archives from a bundle CAR file.
 */
export async function extractDelegationBundle(
  carBytes: Uint8Array,
): Promise<DelegationBundle> {
  const reader = await CarReader.fromBytes(carBytes);
  const roots = await reader.getRoots();
  if (roots.length !== 1) {
    throw new Error(`Expected 1 root in delegation bundle, got ${roots.length}`);
  }
  const rootBlock = await reader.get(roots[0]);
  if (!rootBlock) {
    throw new Error("Could not read root block from delegation bundle");
  }
  const decoded = await decode({
    bytes: rootBlock.bytes,
    codec: cbor,
    hasher: sha256,
  });
  const value = decoded.value as Record<string, unknown>;
  if (!value.upload || !value.name || !value.plan) {
    throw new Error("Delegation bundle missing required keys (upload, name, plan)");
  }
  return {
    upload: value.upload as Uint8Array,
    name: value.name as Uint8Array,
    plan: value.plan as Uint8Array,
    access: value.access as DelegationBundle["access"],
  };
}
