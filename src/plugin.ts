/**
 * OpenClaw Plugin Entry Point
 *
 * Registers:
 * - Background service that syncs ALL agent workspaces with .storacha configs
 * - CLI commands for setup and management (openclaw clawracha ...)
 * - Agent tools for manual sync control
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import type {
  OpenClawPluginApi,
  OpenClawPluginServiceContext,
  AnyAgentTool,
} from "openclaw/plugin-sdk";
import type { DeviceConfig, SyncPluginConfig } from "./types/index.js";
import { SyncEngine } from "./sync.js";
import { FileWatcher } from "./watcher.js";
import { createStorachaClient } from "./utils/client.js";
import {
  decodeDelegation,
  encodeDelegation,
  readDelegationArg,
} from "./utils/delegation.js";
import {
  resolveAgentWorkspace,
  getAgentIds,
} from "./utils/workspace.js";

// Per-workspace sync state
interface WorkspaceSync {
  engine: SyncEngine;
  watcher: FileWatcher;
  workspace: string;
  agentId: string;
}

const activeSyncers = new Map<string, WorkspaceSync>();

// --- Config helpers ---

async function loadDeviceConfig(
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

async function saveDeviceConfig(
  workspace: string,
  config: DeviceConfig,
): Promise<void> {
  const configDir = path.join(workspace, ".storacha");
  await fs.mkdir(configDir, { recursive: true });
  const configPath = path.join(configDir, "config.json");
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));
}

// --- Service helpers ---

async function startWorkspaceSync(
  workspace: string,
  agentId: string,
  pluginConfig: Partial<SyncPluginConfig>,
  logger: { info: (msg: string) => void; warn: (msg: string) => void },
): Promise<WorkspaceSync | null> {
  const deviceConfig = await loadDeviceConfig(workspace);
  if (!deviceConfig || !deviceConfig.setupComplete) {
    return null;
  }

  const storachaClient = await createStorachaClient(deviceConfig);
  const engine = new SyncEngine(storachaClient, workspace);
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
  });

  await watcher.start();
  logger.info(`[${agentId}] Started syncing workspace: ${workspace}`);

  return { engine, watcher, workspace, agentId };
}

// --- Plugin entry ---

export default function plugin(api: OpenClawPluginApi) {
  const pluginConfig = (api.pluginConfig ?? {}) as Partial<SyncPluginConfig>;

  // --- Background service: one syncer per agent workspace ---

  api.registerService({
    id: "storacha-sync",
    async start(ctx: OpenClawPluginServiceContext) {
      if (pluginConfig.enabled === false) {
        ctx.logger.info("Storacha sync disabled via config.");
        return;
      }

      const agentIds = getAgentIds(ctx.config);

      for (const agentId of agentIds) {
        const workspace = resolveAgentWorkspace(ctx.config, agentId);
        try {
          const sync = await startWorkspaceSync(
            workspace,
            agentId,
            pluginConfig,
            ctx.logger,
          );
          if (sync) {
            activeSyncers.set(workspace, sync);
          }
        } catch (err: any) {
          ctx.logger.warn(
            `[${agentId}] Failed to start sync: ${err.message}`,
          );
        }
      }

      if (activeSyncers.size === 0) {
        ctx.logger.info(
          "No agent workspaces configured for Storacha sync. Use `openclaw clawracha init --agent <id>` to set up.",
        );
      } else {
        ctx.logger.info(
          `Storacha sync active for ${activeSyncers.size} workspace(s).`,
        );
      }
    },

    async stop(ctx: OpenClawPluginServiceContext) {
      for (const [workspace, sync] of activeSyncers) {
        await sync.watcher.stop();
        ctx.logger.info(`[${sync.agentId}] Stopped syncing: ${workspace}`);
      }
      activeSyncers.clear();
    },
  });

  // --- Agent tools (keyed by workspace dir) ---

  api.registerTool({
    name: "storacha_sync_status",
    label: "Storacha Sync Status",
    description: "Get the current Storacha workspace sync status",
    parameters: { type: "object", properties: {} } as any,
    execute: async (_params: any, ctx: any) => {
      const workspace = ctx?.workspaceDir;
      const sync = workspace ? activeSyncers.get(workspace) : undefined;
      if (!sync) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Sync not active for this workspace. Set up with `openclaw clawracha init --agent <id>`.",
            },
          ],
          details: null,
        };
      }
      const status = await sync.engine.status();
      return {
        content: [
          { type: "text" as const, text: JSON.stringify(status, null, 2) },
        ],
        details: status,
      };
    },
  } as AnyAgentTool);

  api.registerTool({
    name: "storacha_sync_now",
    label: "Storacha Sync Now",
    description: "Trigger an immediate workspace sync to Storacha",
    parameters: { type: "object", properties: {} } as any,
    execute: async (_params: any, ctx: any) => {
      const workspace = ctx?.workspaceDir;
      const sync = workspace ? activeSyncers.get(workspace) : undefined;
      if (!sync) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Sync not active for this workspace. Set up with `openclaw clawracha init --agent <id>`.",
            },
          ],
          details: null,
        };
      }
      await sync.engine.sync();
      const status = await sync.engine.status();
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ success: true, status }, null, 2),
          },
        ],
        details: status,
      };
    },
  } as AnyAgentTool);

  // --- CLI commands: openclaw clawracha <subcommand> ---

  api.registerCli(
    ({ program, config }) => {
      const clawracha = program
        .command("clawracha")
        .description("Storacha workspace sync commands");

      // Helper to resolve workspace from --agent
      function requireAgent(agentId: string | undefined): {
        agentId: string;
        workspace: string;
      } {
        if (!agentId) {
          console.error(
            "Error: --agent <id> is required. Specify which agent workspace to configure.",
          );
          process.exit(1);
        }
        return {
          agentId,
          workspace: resolveAgentWorkspace(config, agentId),
        };
      }

      // --- init ---
      clawracha
        .command("init")
        .description("Generate an agent identity for Storacha sync")
        .requiredOption("--agent <id>", "Agent ID")
        .action(async (opts: { agent: string }) => {
          try {
            const { agentId, workspace } = requireAgent(opts.agent);

            const existing = await loadDeviceConfig(workspace);
            if (existing?.agentKey) {
              const { Agent } = await import("@storacha/ucn/pail");
              const agent = Agent.parse(existing.agentKey);
              console.log(`Agent already initialized for ${agentId}.`);
              console.log(`Agent DID: ${agent.did()}`);
              if (existing.setupComplete) {
                console.log(
                  `\nSetup is complete. Use \`openclaw clawracha status --agent ${agentId}\` to check sync state.`,
                );
              } else {
                console.log("\nNext step — choose one:");
                console.log(
                  `  New workspace:  openclaw clawracha setup <delegation> --agent ${agentId}`,
                );
                console.log(
                  `  Join existing:  openclaw clawracha join <upload> <name> --agent ${agentId}`,
                );
              }
              return;
            }

            const { Agent } = await import("@storacha/ucn/pail");
            const agent = await Agent.generate();
            const agentKey = Agent.format(agent);

            await saveDeviceConfig(workspace, { agentKey });

            console.log(`🔥 Agent initialized for ${agentId}!`);
            console.log(`Agent DID: ${agent.did()}`);
            console.log("\nNext step — choose one:");
            console.log(
              `  New workspace:  openclaw clawracha setup <delegation> --agent ${agentId}`,
            );
            console.log(
              `  Join existing:  openclaw clawracha join <upload> <name> --agent ${agentId}`,
            );
          } catch (err: any) {
            console.error(`Error: ${err.message}`);
            process.exit(1);
          }
        });

      // --- setup ---
      clawracha
        .command("setup <delegation>")
        .description(
          "Set up a NEW workspace (first device). <delegation> is a file path or base64 CID string.",
        )
        .requiredOption("--agent <id>", "Agent ID")
        .action(async (delegationArg: string, opts: { agent: string }) => {
          try {
            const { agentId, workspace } = requireAgent(opts.agent);

            const deviceConfig = await loadDeviceConfig(workspace);
            if (!deviceConfig?.agentKey) {
              console.error(
                `Run \`openclaw clawracha init --agent ${agentId}\` first.`,
              );
              process.exit(1);
            }
            if (deviceConfig.setupComplete) {
              console.log("Setup already complete.");
              return;
            }

            const delegation = await readDelegationArg(delegationArg);
            const spaceDID = delegation.capabilities[0]?.with;

            const { ok: archiveBytes } = await delegation.archive();
            if (!archiveBytes) {
              throw new Error("Failed to archive delegation");
            }
            deviceConfig.uploadDelegation = encodeDelegation(archiveBytes);
            deviceConfig.spaceDID = spaceDID ?? undefined;
            deviceConfig.setupComplete = true;
            await saveDeviceConfig(workspace, deviceConfig);

            const { Agent } = await import("@storacha/ucn/pail");
            const agent = Agent.parse(deviceConfig.agentKey);

            console.log(`🔥 Storacha workspace ready for ${agentId}!`);
            console.log(`Agent DID: ${agent.did()}`);
            console.log(`Space: ${spaceDID ?? "unknown"}`);
            console.log(
              "\nRestart the gateway to start syncing: `openclaw gateway restart`",
            );
            console.log(
              `\nTo add another device, run \`openclaw clawracha grant <their-DID> --agent ${agentId}\` here,`,
            );
            console.log(
              `then \`openclaw clawracha join <upload> <name> --agent <id>\` on the other device.`,
            );
          } catch (err: any) {
            console.error(`Error: ${err.message}`);
            process.exit(1);
          }
        });

      // --- join ---
      clawracha
        .command("join <upload-delegation> <name-delegation>")
        .description(
          "Join an existing workspace from another device. Arguments are file paths or base64 CID strings.",
        )
        .requiredOption("--agent <id>", "Agent ID")
        .action(
          async (
            uploadArg: string,
            nameArg: string,
            opts: { agent: string },
          ) => {
            try {
              const { agentId, workspace } = requireAgent(opts.agent);

              const deviceConfig = await loadDeviceConfig(workspace);
              if (!deviceConfig?.agentKey) {
                console.error(
                  `Run \`openclaw clawracha init --agent ${agentId}\` first.`,
                );
                process.exit(1);
              }
              if (deviceConfig.setupComplete) {
                console.log("Setup already complete.");
                return;
              }

              const uploadDelegation = await readDelegationArg(uploadArg);
              const nameDelegation = await readDelegationArg(nameArg);

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

              // Pull remote state before watcher starts
              let pullCount = 0;
              const storachaClient = await createStorachaClient(deviceConfig);
              const engine = new SyncEngine(storachaClient, workspace);
              await engine.init(deviceConfig);
              pullCount = await engine.pullRemote();

              // Save name archive after pull
              const exportedArchive = await engine.exportNameArchive();
              deviceConfig.nameArchive = exportedArchive;
              await saveDeviceConfig(workspace, deviceConfig);

              const { Agent } = await import("@storacha/ucn/pail");
              const agent = Agent.parse(deviceConfig.agentKey);

              console.log(`🔥 Joined existing Storacha workspace for ${agentId}!`);
              console.log(`Agent DID: ${agent.did()}`);
              console.log(`Space: ${spaceDID ?? "unknown"}`);
              console.log(`Pulled ${pullCount} files from remote.`);
              console.log(
                "\nRestart the gateway to start syncing: `openclaw gateway restart`",
              );
            } catch (err: any) {
              console.error(`Error: ${err.message}`);
              process.exit(1);
            }
          },
        );

      // --- grant ---
      clawracha
        .command("grant <target-DID>")
        .description("Grant another device access to this workspace")
        .requiredOption("--agent <id>", "Agent ID")
        .action(async (targetDID: string, opts: { agent: string }) => {
          try {
            const { agentId, workspace } = requireAgent(opts.agent);

            if (!targetDID.startsWith("did:")) {
              console.error("Error: target must be a DID (did:key:z...)");
              process.exit(1);
            }

            const deviceConfig = await loadDeviceConfig(workspace);
            if (!deviceConfig) {
              console.error(
                `Not initialized. Run \`openclaw clawracha init --agent ${agentId}\` first.`,
              );
              process.exit(1);
            }

            const results: string[] = [];

            // Re-delegate upload capability
            if (deviceConfig.uploadDelegation) {
              const storachaClient =
                await createStorachaClient(deviceConfig);
              const audience = {
                did: () => targetDID as `did:${string}:${string}`,
              } as any;
              const uploadDel = await storachaClient.createDelegation(
                audience,
                [
                  "space/blob/add",
                  "space/index/add",
                  "upload/add",
                  "filecoin/offer",
                ],
              );
              const { ok: archiveBytes } = await uploadDel.archive();
              if (archiveBytes) {
                results.push(
                  `Upload delegation:\n${encodeDelegation(archiveBytes)}`,
                );
              }
            } else {
              results.push("⚠️ No upload delegation to re-delegate.");
            }

            // Re-delegate name capability
            if (deviceConfig.nameDelegation) {
              const { Agent, Name } = await import("@storacha/ucn/pail");
              const { extract } = await import(
                "@storacha/client/delegation"
              );
              const agent = Agent.parse(deviceConfig.agentKey);

              let name;
              if (deviceConfig.nameArchive) {
                const archiveBytes = decodeDelegation(
                  deviceConfig.nameArchive,
                );
                name = await Name.extract(agent, archiveBytes);
              } else {
                const nameBytes = decodeDelegation(
                  deviceConfig.nameDelegation,
                );
                const { ok: nameDel } = await extract(nameBytes);
                if (nameDel) {
                  name = Name.from(agent, [nameDel]);
                }
              }

              if (name) {
                const nameDel = await name.grant(
                  targetDID as `did:${string}:${string}`,
                );
                const { ok: archiveBytes } = await nameDel.archive();
                if (archiveBytes) {
                  results.push(
                    `Name delegation:\n${encodeDelegation(archiveBytes)}`,
                  );
                }
              }
            } else {
              results.push("⚠️ No name delegation to re-delegate.");
            }

            console.log(`🔥 Delegations for ${targetDID}:\n`);
            for (const r of results) {
              console.log(r);
              console.log();
            }
            console.log("The target device should run:");
            console.log(
              `  openclaw clawracha join <upload-delegation> <name-delegation> --agent <id>`,
            );
            console.log(
              "\nThen restart the gateway: `openclaw gateway restart`",
            );
          } catch (err: any) {
            console.error(`Error: ${err.message}`);
            process.exit(1);
          }
        });

      // --- status ---
      clawracha
        .command("status")
        .description("Show Storacha sync status for an agent workspace")
        .requiredOption("--agent <id>", "Agent ID")
        .action(async (opts: { agent: string }) => {
          try {
            const { agentId, workspace } = requireAgent(opts.agent);

            const deviceConfig = await loadDeviceConfig(workspace);
            if (!deviceConfig) {
              console.log(
                `Not initialized. Run \`openclaw clawracha init --agent ${agentId}\` first.`,
              );
              return;
            }

            console.log(`🔥 Storacha Sync Status [${agentId}]`);
            console.log(`Workspace: ${workspace}`);
            console.log(
              `Upload delegation: ${deviceConfig.uploadDelegation ? "✅" : "❌ not set"}`,
            );
            console.log(
              `Name delegation: ${deviceConfig.nameDelegation ? "✅" : "❌ not set"}`,
            );
            console.log(`Space DID: ${deviceConfig.spaceDID ?? "unknown"}`);
            console.log(
              `Name Archive: ${deviceConfig.nameArchive ? "saved" : "not created"}`,
            );
            console.log(
              `Setup complete: ${deviceConfig.setupComplete ? "✅" : "❌"}`,
            );

            const sync = activeSyncers.get(workspace);
            if (sync) {
              const status = await sync.engine.status();
              console.log(`Running: true`);
              console.log(
                `Last Sync: ${status.lastSync ? new Date(status.lastSync).toISOString() : "never"}`,
              );
              console.log(`Entries: ${status.entryCount}`);
              console.log(`Pending: ${status.pendingChanges}`);
            } else {
              console.log(`Running: false`);
            }
          } catch (err: any) {
            console.error(`Error: ${err.message}`);
            process.exit(1);
          }
        });
    },
    { commands: ["clawracha"] },
  );
}
