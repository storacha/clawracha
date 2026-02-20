/**
 * Encryption helpers for private spaces.
 * Uses @storacha/encrypt-upload-client with KMS-based key management.
 */

import type { Block } from "multiformats";
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
import { encryptFile, encryptedBlockStream } from "@storacha/encrypt-upload-client/utils/encrypt";

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
 * Wrap raw bytes as a BlobLike for encryption.
 */
export function bytesToBlobLike(bytes: Uint8Array): BlobLike {
  return {
    stream: () =>
      new ReadableStream({
        start(controller) {
          controller.enqueue(bytes as Uint8Array<ArrayBuffer>);
          controller.close();
        },
      }),
  } as BlobLike;
}
