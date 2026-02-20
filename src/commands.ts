/**
 * Extracted command logic for Storacha workspace sync.
 *
 * Shared by CLI commands (thin wrappers in plugin.ts) and the
 * interactive `onboard` command.
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import type { OpenClawConfig } from "openclaw/plugin-sdk";
import type { DeviceConfig, SyncPluginConfig } from "./types/index.js";
import { SyncEngine } from "./sync.js";
import { FileWatcher } from "./watcher.js";
import {
  encodeDelegation,
  readDelegationArg,
} from "./utils/delegation.js";
import { Agent } from "@storacha/ucn/pail";

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
  const engine = new SyncEngine(workspace);
  await engine.init(deviceConfig);

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
  delegationArg: string,
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

  const delegation = await readDelegationArg(delegationArg);
  const spaceDID = delegation.capabilities[0]?.with;

  const { ok: archiveBytes } = await delegation.archive();
  if (!archiveBytes) throw new Error("Failed to archive delegation");

  deviceConfig.uploadDelegation = encodeDelegation(archiveBytes);
  deviceConfig.spaceDID = spaceDID ?? undefined;
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

  const agent = Agent.parse(deviceConfig.agentKey);
  return { agentDID: agent.did(), spaceDID: spaceDID ?? undefined };
}

export async function doSetupWithLogin(
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

  console.log(`Creating space "${spaceName}"...`);
  const space = await tempClient.createSpace(spaceName, { account });
  await tempClient.setCurrentSpace(space.did());

  // Delegate upload access from the new space to our clawracha agent
  const agent = Agent.parse(deviceConfig.agentKey);
  const audience = { did: () => agent.did() } as any;
  const delegation = await tempClient.createDelegation(
    audience,
    Object.keys(spaceAccess),
    { expiration: Infinity },
  );

  const { ok: archiveBytes } = await delegation.archive();
  if (!archiveBytes) throw new Error("Failed to archive delegation");

  deviceConfig.uploadDelegation = encodeDelegation(archiveBytes);
  deviceConfig.spaceDID = space.did();
  deviceConfig.setupComplete = true;
  await saveDeviceConfig(workspace, deviceConfig);

  // One-shot sync: scan existing files, upload, stop
  const sync = await startWorkspaceSync(
    workspace, agentId, pluginConfig, true, console,
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

export async function doJoin(
  workspace: string,
  agentId: string,
  uploadDelegationArg: string,
  nameDelegationArg: string,
  pluginConfig: Partial<SyncPluginConfig>,
  gatewayConfig?: NonNullable<OpenClawConfig["gateway"]>,
): Promise<JoinResult> {
  const deviceConfig = await loadDeviceConfig(workspace);
  if (!deviceConfig?.agentKey) {
    throw new Error("Not initialized. Run init first.");
  }
  if (deviceConfig.setupComplete) {
    const agent = Agent.parse(deviceConfig.agentKey);
    return { agentDID: agent.did(), spaceDID: deviceConfig.spaceDID, pullCount: 0 };
  }

  const uploadDelegation = await readDelegationArg(uploadDelegationArg);
  const nameDelegation = await readDelegationArg(nameDelegationArg);
  const spaceDID = uploadDelegation.capabilities[0]?.with;

  const { ok: uploadArchive } = await uploadDelegation.archive();
  if (!uploadArchive) throw new Error("Failed to archive upload delegation");
  const { ok: nameArchiveBytes } = await nameDelegation.archive();
  if (!nameArchiveBytes) throw new Error("Failed to archive name delegation");

  deviceConfig.uploadDelegation = encodeDelegation(uploadArchive);
  deviceConfig.nameDelegation = encodeDelegation(nameArchiveBytes);
  deviceConfig.spaceDID = spaceDID ?? undefined;
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
  return { agentDID: agent.did(), spaceDID: spaceDID ?? undefined, pullCount };
}
