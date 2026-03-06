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

const GOOGLE_KMS_URL = "https://ucan-kms-production.protocol-labs.workers.dev";
const GOOGLE_KMS_DID =
  "did:key:z6MksQJobJmBfPhjHWgFXVppqM6Fcjc1k7xu4z6xvusVrtKv";
const LOCAL_KMS_URL = "http://127.0.0.1:8787";

import type { KmsEndpoint } from "../types/index.js";

/**
 * Resolve the KMS endpoint for a given provider.
 * For Google KMS, returns hardcoded production values.
 * For 1Password, discovers the DID from the local server via GET /.
 */
export async function resolveKmsEndpoint(
  provider: "google" | "1password",
): Promise<KmsEndpoint> {
  if (provider === "google") {
    return { url: GOOGLE_KMS_URL, did: GOOGLE_KMS_DID };
  }
  // 1password — discover DID from local server
  const res = await fetch(`${LOCAL_KMS_URL}/`);
  if (!res.ok) {
    throw new Error(`Local KMS server not reachable at ${LOCAL_KMS_URL}`);
  }
  const text = await res.text();
  const lines = text.trim().split("\n");
  // Find the did:key: line (signer DID) — works for both local and production formats
  const did = lines.map((l) => l.trim()).find((l) => l.startsWith("did:key:"));
  if (!did) {
    throw new Error("Could not discover DID from local KMS server");
  }
  return { url: LOCAL_KMS_URL, did };
}

const adapterCache = new Map<string, CryptoAdapter>();

export function getKMSCryptoAdapter(endpoint?: KmsEndpoint): CryptoAdapter {
  const url = endpoint?.url ?? GOOGLE_KMS_URL;
  const did = endpoint?.did ?? GOOGLE_KMS_DID;
  const key = `${url}|${did}`;
  let adapter = adapterCache.get(key);
  if (!adapter) {
    const isLocal = (() => {
      try {
        const { hostname } = new URL(url);
        return hostname === "localhost" || hostname === "127.0.0.1";
      } catch {
        return false;
      }
    })();
    adapter = isLocal
      ? createGenericKMSAdapter(url, did, { allowInsecureHttp: true })
      : createGenericKMSAdapter(url, did);
    adapterCache.set(key, adapter);
  }
  return adapter;
}

export async function getEncryptedClient(
  storachaClient: Client,
  endpoint?: KmsEndpoint,
): Promise<EncryptedClient> {
  const cryptoAdapter = getKMSCryptoAdapter(endpoint);
  return createEncryptedClient({
    storachaClient,
    cryptoAdapter,
  });
}

export async function delegatePlanningDelegationToKMS(
  agent: Signer,
  planDelegation: Delegation,
  endpoint?: KmsEndpoint,
): Promise<Proof> {
  const did = endpoint?.did ?? GOOGLE_KMS_DID;
  return await delegate({
    issuer: agent,
    audience: { did: () => did } as any,
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
  location?: string,
  keyring?: string,
): EncryptionConfig {
  return {
    issuer: issuer as any,
    spaceDID,
    proofs,
    location,
    keyring,
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
  endpoint?: KmsEndpoint,
): Promise<ReadableStream<Block>> {
  const adapter = getKMSCryptoAdapter(endpoint);
  const payload = await encryptFile(adapter, file, encryptionConfig);
  return encryptedBlockStream(payload, adapter) as any;
}
