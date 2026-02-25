/**
 * Helpers for building runtime objects from DeviceConfig.
 *
 * - createStorachaClient: Storacha upload client
 * - resolveNameFromConfig: UCN Pail NameView
 * - resolveCryptoConfig: encryption / decryption config (private spaces)
 */

import { Agent as PailAgent, Name } from "@storacha/ucn/pail";
import type { NameView } from "@storacha/ucn/pail/api";
import { create as createClient } from "@storacha/client";
import { StoreMemory } from "@storacha/client/stores/memory";
import { extract } from "@storacha/client/delegation";
import { decodeDelegation } from "./delegation.js";
import {
  makeEncryptionConfig,
  makeDecryptionConfig,
  delegatePlanningDelegationToKMS,
} from "./crypto.js";
import type { DeviceConfig, CryptoConfig } from "../types/index.js";
import type { Client } from "@storacha/client";

/**
 * Build a Storacha Client from device config.
 * Requires agentKey and uploadDelegation to be present.
 */
export async function createStorachaClient(
  config: DeviceConfig,
): Promise<Client> {
  if (!config.uploadDelegation) {
    throw new Error("No upload delegation in device config");
  }

  const agent = PailAgent.parse(config.agentKey);

  const client = await createClient({
    principal: agent,
    store: new StoreMemory(),
  });

  // Import the upload delegation (space → agent)
  const uploadBytes = decodeDelegation(config.uploadDelegation);
  const { ok: uploadDelegation, error: uploadErr } = await extract(uploadBytes);
  if (!uploadDelegation) {
    throw new Error(`Failed to extract upload delegation: ${uploadErr}`);
  }

  // addSpace registers the space and adds the delegation as a proof
  await client.addSpace(uploadDelegation);

  // Set the space as current so uploads target it
  const spaceDID = uploadDelegation.capabilities[0]?.with;
  if (spaceDID) {
    await client.setCurrentSpace(spaceDID as `did:key:${string}`);
  }

  return client;
}

/**
 * Resolve a UCN Pail NameView from device config.
 * Picks the right path: archive → delegation → create new.
 */
export async function resolveNameFromConfig(
  config: DeviceConfig,
): Promise<NameView> {
  const agent = PailAgent.parse(config.agentKey);

  if (config.nameArchive) {
    const archiveBytes = decodeDelegation(config.nameArchive);
    return Name.extract(agent, archiveBytes);
  } else if (config.nameDelegation) {
    const nameBytes = decodeDelegation(config.nameDelegation);
    const { ok: delegation } = await extract(nameBytes);
    if (!delegation) throw new Error("Failed to extract name delegation");
    return Name.from(agent, [delegation]);
  } else {
    return Name.create(agent);
  }
}

/**
 * Build encryption/decryption config from device config.
 * Returns null for public spaces.
 */
export async function resolveCryptoConfig(
  config: DeviceConfig,
): Promise<CryptoConfig | null> {
  if (config.access?.type !== "private") return null;

  if (!config.planDelegation) {
    throw new Error("Private space requires a plan delegation for KMS access");
  }

  const agent = PailAgent.parse(config.agentKey);

  const planBytes = decodeDelegation(config.planDelegation);
  const { ok: planDel } = await extract(planBytes);
  if (!planDel) throw new Error("Failed to extract plan delegation");

  const planDelForKMS = await delegatePlanningDelegationToKMS(agent, planDel);

  const uploadBytes = decodeDelegation(config.uploadDelegation!);
  const { ok: uploadDel } = await extract(uploadBytes);
  if (!uploadDel) throw new Error("Failed to extract upload delegation");

  const encryptionConfig = makeEncryptionConfig(
    agent,
    config.spaceDID as `did:key:${string}`,
    [planDelForKMS, uploadDel],
  );

  const decryptionConfig = makeDecryptionConfig(
    config.spaceDID as `did:key:${string}`,
    uploadDel,
    [planDelForKMS, uploadDel],
  );

  return {
    encryptionConfig,
    decryptionConfig,
  };
}
