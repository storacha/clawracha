/**
 * Create a @storacha/client instance from an agent private key and upload delegation.
 *
 * Uses the top-level `create()` factory which accepts principal + store directly,
 * avoiding internal @storacha/access imports.
 */

import { Agent as PailAgent } from "@storacha/ucn/pail";
import { create as createClient } from "@storacha/client";
import { StoreMemory } from "@storacha/client/stores/memory";
import { extract } from "@storacha/client/delegation";
import type { DeviceConfig } from "../types/index.js";
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
  const uploadBytes = Buffer.from(config.uploadDelegation, "base64");
  const { ok: uploadDelegation, error: uploadErr } =
    await extract(uploadBytes);
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
