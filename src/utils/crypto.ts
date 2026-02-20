/**
 * Encryption helpers for private spaces.
 * Uses @storacha/encrypt-upload-client with KMS-based key management.
 */

import type { Block } from "multiformats";
import type { CID } from "multiformats/cid";
import type { Client } from "@storacha/client";
import type { Proof } from "@ucanto/interface";
type SpaceDID = `did:key:${string}`;
import type {
  CryptoAdapter,
  EncryptionConfig,
  DecryptionConfig,
  BlobLike,
  EncryptedClient,
} from "@storacha/encrypt-upload-client/types";
import { createGenericKMSAdapter } from "@storacha/encrypt-upload-client/factories.node";
import { create as createEncryptedClient } from "@storacha/encrypt-upload-client";
import {
  encryptFile,
  encryptedBlockStream,
} from "@storacha/encrypt-upload-client/utils/encrypt";

const KMS_SERVICE_URL = "https://kms.storacha.network";
const KMS_SERVICE_DID = "did:web:kms.storacha.network";

let cachedAdapter: CryptoAdapter | null = null;

export function getKMSCryptoAdapter(): CryptoAdapter {
  if (cachedAdapter) return cachedAdapter;
  cachedAdapter = createGenericKMSAdapter(KMS_SERVICE_URL, KMS_SERVICE_DID);
  return cachedAdapter;
}

export async function getEncryptedClient(
  storachaClient: Client,
): Promise<EncryptedClient> {
  const cryptoAdapter = getKMSCryptoAdapter();
  return createEncryptedClient({
    storachaClient,
    cryptoAdapter,
  });
}

export function makeEncryptionConfig(
  issuer: { did: () => `did:key:${string}` },
  spaceDID: SpaceDID,
  proofs: Proof[],
): EncryptionConfig {
  return {
    issuer: issuer as any,
    spaceDID,
    proofs,
  };
}

export function makeDecryptionConfig(
  spaceDID: SpaceDID,
  decryptDelegation: Proof,
  proofs?: Proof[],
): DecryptionConfig {
  return {
    spaceDID,
    decryptDelegation,
    proofs,
  };
}

/**
 * Encrypt a BlobLike and return a block stream
 * (UnixFS-encoded encrypted content + metadata block appended).
 */
export async function encryptToBlockStream(
  file: BlobLike,
  encryptionConfig: EncryptionConfig,
): Promise<ReadableStream<Block>> {
  const adapter = getKMSCryptoAdapter();
  const payload = await encryptFile(adapter, file, encryptionConfig);
  return encryptedBlockStream(payload, adapter) as any;
}

/**
 * Drain a ReadableStream into a single Uint8Array.
 */
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

/**
 * Create a decrypt function for mdsync resolveValue.
 * Fetches encrypted content by CID via EncryptedClient and returns decrypted bytes.
 */
export function makeDecryptFn(
  encryptedClient: EncryptedClient,
  decryptionConfig: DecryptionConfig,
): (cid: CID) => Promise<Uint8Array> {
  return async (cid: CID): Promise<Uint8Array> => {
    const { stream } = await encryptedClient.retrieveAndDecryptFile(
      cid,
      decryptionConfig,
    );
    return drainStream(stream);
  };
}
