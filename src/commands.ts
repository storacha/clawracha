/**
 * Extracted command logic for Storacha workspace sync.
 *
 * Shared by CLI commands (thin wrappers in plugin.ts) and the
 * interactive `onboard` command.
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import type { OpenClawConfig } from "openclaw/plugin-sdk";
import type {
  DeviceConfig,
  SpaceAccess,
  SyncPluginConfig,
} from "./types/index.js";
import { SyncEngine } from "./sync.js";
import { FileWatcher } from "./watcher.js";
import {
  encodeDelegation,
  decodeDelegation,
  readDelegationArg,
} from "./utils/delegation.js";
import { createStorachaClient } from "./utils/config.js";
import {
  createDelegationBundle,
  extractDelegationBundle,
} from "./utils/bundle.js";
import { Agent, Name } from "@storacha/ucn/pail";
import { extract } from "@storacha/client/delegation";
import { delegate } from "@ucanto/core";
import { CID } from "multiformats/basics";
import { base64 } from "multiformats/bases/base64";
import { identity } from "multiformats/hashes/identity";
import { startLocalKms } from "./kms/local.js";

// --- Per-workspace sync state (returned by startWorkspaceSync) ---

export interface WorkspaceSync {
  engine: SyncEngine;
  watcher: FileWatcher;
  workspace: string;
  agentId: string;
}

// --- Config helpers ---

export async function loadDeviceConfig(
  workspace: string,
): Promise<DeviceConfig | null> {
  const configPath = path.join(workspace, ".storacha", "config.json");
  try {
    const content = await fs.readFile(configPath, "utf-8");
    return JSON.parse(content) as DeviceConfig;
  } catch (err: any) {
    if (err.code === "ENOENT") return null;
    throw err;
  }
}

export async function saveDeviceConfig(
  workspace: string,
  config: DeviceConfig,
): Promise<void> {
  const configDir = path.join(workspace, ".storacha");
  await fs.mkdir(configDir, { recursive: true });
  const configPath = path.join(configDir, "config.json");
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));
}

export async function requestWorkspaceUpdate(
  workspace: string,
  agentId: string,
  gatewayConfig: NonNullable<OpenClawConfig["gateway"]>,
): Promise<void> {
  const DEFAULT_GATEWAY_PORT = 18789;
  let port = DEFAULT_GATEWAY_PORT;
  if (
    typeof gatewayConfig.port === "number" &&
    Number.isFinite(gatewayConfig.port) &&
    gatewayConfig.port > 0
  ) {
    port = gatewayConfig.port;
  }

  const url = `http://127.0.0.1:${port}/api/channels/clawracha/workspace-update`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = gatewayConfig.auth?.token ?? gatewayConfig.auth?.password;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ agentId, workspace }),
    });
    if (!res.ok) {
      console.warn(
        `Warning: Failed to notify gateway (${res.status}). Restart the gateway to pick up changes.`,
      );
    }
  } catch (err: any) {
    console.warn(
      `Warning: Could not reach gateway at ${url}: ${err.message}. Restart the gateway to pick up changes.`,
    );
  }
}

// --- Sync lifecycle ---

export async function startWorkspaceSync(
  workspace: string,
  agentId: string,
  pluginConfig: Partial<SyncPluginConfig>,
  initialAdd: boolean,
  logger: { info: (msg: string) => void; warn: (msg: string) => void },
): Promise<WorkspaceSync | null> {
  const deviceConfig = await loadDeviceConfig(workspace);
  if (!deviceConfig || !deviceConfig.setupComplete) {
    return null;
  }
  if (deviceConfig.kmsProvider === "1password") {
    await startLocalKms();
  }
  const engine = await SyncEngine.fromConfig(workspace, deviceConfig);
  await engine.start();

  const watcher = new FileWatcher({
    workspace,
    config: {
      enabled: true,
      watchPatterns: pluginConfig.watchPatterns ?? ["**/*"],
      ignorePatterns: pluginConfig.ignorePatterns ?? [
        ".storacha/**",
        "node_modules/**",
        ".git/**",
        "dist/**",
      ],
    },
    onChanges: async (changes) => {
      await engine.processChanges(changes);
      await engine.sync();

      const nameArchive = await engine.exportNameArchive();
      const updatedConfig = { ...deviceConfig, nameArchive };
      await saveDeviceConfig(workspace, updatedConfig);
    },
    initialAdd,
  });

  await watcher.start();
  logger.info(`[${agentId}] Started syncing workspace: ${workspace}`);

  return { engine, watcher, workspace, agentId };
}

// --- Result types ---

export interface InitResult {
  alreadyInitialized: boolean;
  setupComplete: boolean;
  agentDID: string;
  agentKey: string;
}

export interface SetupResult {
  agentDID: string;
  spaceDID: string | undefined;
}

export interface JoinResult {
  agentDID: string;
  spaceDID: string | undefined;
  pullCount: number;
}

// --- Core command logic ---

export async function doInit(workspace: string): Promise<InitResult> {
  const existing = await loadDeviceConfig(workspace);
  if (existing?.agentKey) {
    const agent = Agent.parse(existing.agentKey);
    return {
      alreadyInitialized: true,
      setupComplete: !!existing.setupComplete,
      agentDID: agent.did(),
      agentKey: existing.agentKey,
    };
  }

  const agent = await Agent.generate();
  const agentKey = Agent.format(agent);
  await saveDeviceConfig(workspace, { agentKey });

  return {
    alreadyInitialized: false,
    setupComplete: false,
    agentDID: agent.did(),
    agentKey,
  };
}

export async function doSetup(
  workspace: string,
  agentId: string,
  email: string,
  spaceName: string,
  pluginConfig: Partial<SyncPluginConfig>,
  gatewayConfig?: NonNullable<OpenClawConfig["gateway"]>,
): Promise<SetupResult> {
  const deviceConfig = await loadDeviceConfig(workspace);
  if (!deviceConfig?.agentKey) {
    throw new Error("Not initialized. Run init first.");
  }
  if (deviceConfig.setupComplete) {
    const agent = Agent.parse(deviceConfig.agentKey);
    return { agentDID: agent.did(), spaceDID: deviceConfig.spaceDID };
  }

  const { create: createClient } = await import("@storacha/client");
  const { spaceAccess } = await import("@storacha/client/capability/access");
  const tempClient = await createClient();

  console.log(`\nA confirmation email will be sent to ${email}.`);
  console.log("Please click the link in the email to continue...");
  const account = await tempClient.login(email as `${string}@${string}`);

  console.log("✅ Email confirmed!");
  console.log("Checking payment plan...");
  await account.plan.wait();
  console.log("✅ Payment plan active!");

  const { choose } = await import("./prompts.js");
  const accessChoice = await choose(
    "\nSpace access type:\n" +
      "  ⚠️  Public — workspace data is accessible by anyone with the CID\n" +
      "  🔒 Private — data is encrypted (requires paid plan)",
    ["Public", "Private (encrypted)"],
  );

  let kmsProvider: "google" | "1password" | undefined;
  let kmsLocation: string | undefined;
  let kmsKeyring: string | undefined;
  let access: SpaceAccess;

  if (accessChoice === "Private (encrypted)") {
    const { prompt: askPrompt } = await import("./prompts.js");
    const providerChoice = await choose(
      "\nKey management provider:\n" +
        "  ⚠️  Storacha Cloud requires a paid plan\n" +
        "  🔒 1Password runs a local KMS server",
      ["Storacha Cloud (Google KMS)", "1Password (local)"],
    );
    kmsProvider =
      providerChoice === "1Password (local)" ? "1password" : "google";

    if (kmsProvider === "google") {
      // Google KMS: Storacha manages server-side encryption
      access = {
        type: "private" as const,
        encryption: {
          provider: "google-kms" as const,
          algorithm: "RSA_DECRYPT_OAEP_3072_SHA256" as const,
        },
      };
    } else {
      // 1Password: encryption is local, Storacha sees a public space
      access = { type: "public" as const };
      kmsLocation = await askPrompt("1Password account name: ");
      if (!kmsLocation) {
        throw new Error(
          "1Password account name is required for encrypted spaces",
        );
      }
      const vaultAnswer = await askPrompt(
        'Vault name (default "Storacha Space Keys"): ',
      );
      kmsKeyring = vaultAnswer || "Storacha Space Keys";
    }
  } else {
    access = { type: "public" as const };
  }

  console.log(`Creating space "${spaceName}"...`);
  const space = await tempClient.createSpace(spaceName, { account, access } as any);
  await tempClient.setCurrentSpace(space.did());

  // Delegate space access from the new space to our clawracha agent
  const agent = Agent.parse(deviceConfig.agentKey);
  const audience = { did: () => agent.did() } as any;
  const uploadDelegation = await tempClient.createDelegation(
    audience,
    Object.keys(spaceAccess) as any,
    { expiration: Infinity },
  );

  const { ok: uploadArchive } = await uploadDelegation.archive();
  if (!uploadArchive) throw new Error("Failed to archive upload delegation");

  // Delegate plan/get from account → clawracha agent
  const accountDID = account.did();
  const planProofs = tempClient.agent.proofs([
    {
      can: "plan/get",
      with: accountDID,
    },
  ] as any);
  const planDelegation = await delegate({
    issuer: tempClient.agent.issuer,
    audience: { did: () => agent.did() } as any,
    capabilities: [{ can: "plan/get", with: accountDID }] as any,
    proofs: planProofs,
    expiration: Infinity,
  });
  const { ok: planArchive } = await planDelegation.archive();
  if (!planArchive) throw new Error("Failed to archive plan delegation");

  deviceConfig.uploadDelegation = encodeDelegation(uploadArchive);
  deviceConfig.planDelegation = encodeDelegation(planArchive);
  deviceConfig.spaceDID = space.did();
  deviceConfig.storachaAccess = access;
  deviceConfig.kmsProvider = kmsProvider;
  deviceConfig.kmsLocation = kmsLocation;
  deviceConfig.kmsKeyring = kmsKeyring;
  deviceConfig.setupComplete = true;
  await saveDeviceConfig(workspace, deviceConfig);

  // One-shot sync: scan existing files, upload, stop
  const sync = await startWorkspaceSync(
    workspace,
    agentId,
    pluginConfig,
    true,
    console,
  );
  if (!sync) throw new Error("Failed to start sync engine");
  await sync.watcher.waitForReady();
  await sync.watcher.stop();
  await sync.watcher.forceFlush();
  await sync.engine.stop();

  if (gatewayConfig) {
    await requestWorkspaceUpdate(workspace, agentId, gatewayConfig);
  }

  return { agentDID: agent.did(), spaceDID: space.did() };
}

// --- Bundle arg helper ---

/**
 * Read a delegation bundle from a file path or base64-encoded string.
 * Returns raw CAR bytes.
 */
async function readBundleArg(arg: string): Promise<Uint8Array> {
  // Try as file path first
  try {
    const bytes = await fs.readFile(arg);
    return new Uint8Array(bytes);
  } catch (err: any) {
    if (err.code !== "ENOENT" && err.code !== "ENAMETOOLONG") throw err;
  }
  // Try as base64
  const cid = CID.parse(arg, base64);
  if (cid.multihash.code !== identity.code) {
    console.error(
      `Error: failed to read proof. Must be identity CID. Fetching of remote proof CARs not supported by this command yet`,
    );
    throw new Error("Invalid proof CAR argument");
  }
  return cid.multihash.digest;
}

export async function doJoin(
  workspace: string,
  agentId: string,
  bundleArg: string,
  pluginConfig: Partial<SyncPluginConfig>,
  gatewayConfig?: NonNullable<OpenClawConfig["gateway"]>,
): Promise<JoinResult> {
  const deviceConfig = await loadDeviceConfig(workspace);
  if (!deviceConfig?.agentKey) {
    throw new Error("Not initialized. Run init first.");
  }
  if (deviceConfig.setupComplete) {
    const agent = Agent.parse(deviceConfig.agentKey);
    return {
      agentDID: agent.did(),
      spaceDID: deviceConfig.spaceDID,
      pullCount: 0,
    };
  }

  const bundleBytes = await readBundleArg(bundleArg);
  const bundle = await extractDelegationBundle(bundleBytes);

  const { ok: uploadDelegation, error: uploadErr } = await extract(
    bundle.upload,
  );
  if (!uploadDelegation)
    throw new Error(`Failed to extract upload delegation: ${uploadErr}`);
  const { ok: nameDelegation, error: nameErr } = await extract(bundle.name);
  if (!nameDelegation)
    throw new Error(`Failed to extract name delegation: ${nameErr}`);
  const { ok: planDelegation, error: planErr } = await extract(bundle.plan);
  if (!planDelegation)
    throw new Error(`Failed to extract plan delegation: ${planErr}`);

  const spaceDID = uploadDelegation.capabilities[0]?.with;

  deviceConfig.uploadDelegation = encodeDelegation(bundle.upload);
  deviceConfig.nameDelegation = encodeDelegation(bundle.name);
  deviceConfig.planDelegation = encodeDelegation(bundle.plan);
  deviceConfig.spaceDID = spaceDID ?? undefined;
  if (bundle.access) {
    deviceConfig.storachaAccess = bundle.access as SpaceAccess;
  }
  deviceConfig.kmsProvider = bundle.kmsProvider;
  deviceConfig.kmsLocation = bundle.kmsLocation;
  deviceConfig.kmsKeyring = bundle.kmsKeyring;
  deviceConfig.setupComplete = true;
  await saveDeviceConfig(workspace, deviceConfig);

  // One-shot sync: pull remote, stop
  const sync = await startWorkspaceSync(
    workspace,
    agentId,
    pluginConfig,
    false,
    console,
  );
  if (!sync) throw new Error("Failed to start sync engine");

  const pullCount = await sync.engine.pullRemote();
  await sync.watcher.stop();
  await sync.watcher.forceFlush();
  await sync.engine.stop();

  if (gatewayConfig) {
    await requestWorkspaceUpdate(workspace, agentId, gatewayConfig);
  }

  const agent = Agent.parse(deviceConfig.agentKey);
  return {
    agentDID: agent.did(),
    spaceDID: spaceDID ?? undefined,
    pullCount,
  };
}

export async function doGrant(
  workspace: string,
  targetDID: `did:${string}:${string}`,
): Promise<Uint8Array> {
  const deviceConfig = await loadDeviceConfig(workspace);
  if (!deviceConfig?.setupComplete) {
    throw new Error("Workspace not set up. Run setup first.");
  }

  // Upload delegation: re-delegate space access
  const storachaClient = await createStorachaClient(deviceConfig);
  const { spaceAccess } = await import("@storacha/client/capability/access");
  const audience = { did: () => targetDID } as any;
  const uploadDel = await storachaClient.createDelegation(
    audience,
    Object.keys(spaceAccess) as any,
    { expiration: Infinity },
  );
  const { ok: uploadArchive } = await uploadDel.archive();
  if (!uploadArchive) throw new Error("Failed to archive upload delegation");

  // Name delegation: re-delegate via name.grant()
  const agent = Agent.parse(deviceConfig.agentKey);
  let name;
  if (deviceConfig.nameArchive) {
    const archiveBytes = decodeDelegation(deviceConfig.nameArchive);
    name = await Name.extract(agent, archiveBytes);
  } else if (deviceConfig.nameDelegation) {
    const nameBytes = decodeDelegation(deviceConfig.nameDelegation);
    const { ok: nameDel } = await extract(nameBytes);
    if (nameDel) name = Name.from(agent, [nameDel]);
  }
  if (!name) throw new Error("No name state available to grant from");
  const nameDel = await name.grant(targetDID);
  const { ok: nameArchive } = await nameDel.archive();
  if (!nameArchive) throw new Error("Failed to archive name delegation");

  // Plan delegation: re-delegate from stored plan delegation
  if (!deviceConfig.planDelegation) {
    throw new Error("No plan delegation to re-delegate");
  }
  const planBytes = decodeDelegation(deviceConfig.planDelegation);
  const { ok: existingPlanDel } = await extract(planBytes);
  if (!existingPlanDel) throw new Error("Failed to extract plan delegation");
  const planDel = await delegate({
    issuer: agent,
    audience,
    capabilities: existingPlanDel.capabilities as any,
    proofs: [existingPlanDel],
    expiration: Infinity,
  });
  const { ok: planArchive } = await planDel.archive();
  if (!planArchive) throw new Error("Failed to archive plan delegation");

  return createDelegationBundle({
    upload: uploadArchive,
    name: nameArchive,
    plan: planArchive,
    access: deviceConfig.storachaAccess,
    kmsProvider: deviceConfig.kmsProvider,
    kmsLocation: deviceConfig.kmsLocation,
    kmsKeyring: deviceConfig.kmsKeyring,
  });
}
