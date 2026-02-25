/**
 * Encryption helpers for private spaces.
 * Uses @storacha/encrypt-upload-client with KMS-based key management.
 */

import type { Block } from "multiformats";
import type { CID } from "multiformats/cid";
import type { Client } from "@storacha/client";
import type { Proof, Signer } from "@ucanto/interface";
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
import { Delegation } from "@ucanto/interface";
import { delegate } from "@ucanto/core";

const KMS_SERVICE_URL = "https://ucan-kms-production.protocol-labs.workers.dev";
const KMS_SERVICE_DID =
  "did:key:z6MksQJobJmBfPhjHWgFXVppqM6Fcjc1k7xu4z6xvusVrtKv";

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

export async function delegatePlanningDelegationToKMS(
  agent: Signer,
  planDelegation: Delegation,
): Promise<Proof> {
  return await delegate({
    issuer: agent,
    audience: { did: () => KMS_SERVICE_DID } as any,
    capabilities: [
      { can: "plan/get", with: planDelegation.capabilities[0].with },
    ] as any,
    proofs: [planDelegation],
    expiration: Infinity,
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
