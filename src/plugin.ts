/**
 * OpenClaw Plugin Entry Point
 *
 * Registers:
 * - Background service that syncs ALL agent workspaces with .storacha configs
 * - CLI commands for setup and management (openclaw clawracha ...)
 * - Agent tools for manual sync control
 */

import { json as consumeJson } from "stream/consumers";
import type {
  OpenClawPluginApi,
  OpenClawPluginServiceContext,
  AnyAgentTool,
} from "openclaw/plugin-sdk";
import type { SyncPluginConfig } from "./types/index.js";
import { SyncEngine } from "./sync.js";
import { createStorachaClient } from "./utils/client.js";
import {
  decodeDelegation,
  encodeDelegation,
} from "./utils/delegation.js";
import { resolveAgentWorkspace, getAgentIds } from "./utils/workspace.js";
import { Agent, Name } from "@storacha/ucn/pail";
import { extract } from "@storacha/client/delegation";
import * as z from "zod";
import { spaceAccess } from "@storacha/client/capability/access";
import {
  type WorkspaceSync,
  loadDeviceConfig,
  saveDeviceConfig,
  requestWorkspaceUpdate,
  startWorkspaceSync,
  doInit,
  doSetup,
  doSetupWithLogin,
  doJoin,
} from "./commands.js";

const activeSyncers = new Map<string, WorkspaceSync>();

// --- Config helpers ---
const UpdateParams = z.object({
  agentId: z.string(),
  workspace: z.string(),
});

// --- Plugin entry ---

export default function plugin(api: OpenClawPluginApi) {
  const pluginConfig = (api.pluginConfig ?? {}) as Partial<SyncPluginConfig>;
  // --- Background service: one syncer per agent workspace ---
  api.registerHttpHandler(async (req, res) => {
    const url = new URL(
      req.url ?? "/",
      `http://${req.headers.host ?? "localhost"}`,
    );

    // Only handle /api/channels/clawracha/workspace-update
    if (!url.pathname.startsWith("/api/channels/clawracha/workspace-update")) {
      return false;
    }

    // only handle post requests
    if (req.method !== "POST") {
      return false;
    }

    const body = await consumeJson(req);
    const paramsResult = UpdateParams.safeParse(body);
    if (paramsResult.success === false) {
      res.statusCode = 400;
      res.end(
        JSON.stringify({
          error: "Invalid parameters",
          details: paramsResult.error,
        }),
      );
      return true;
    }
    const updateParams = paramsResult.data;
    const sync = activeSyncers.get(updateParams.workspace);
    if (sync) {
      // stop active sync engine if present
      // waiting for any active syncs to flush.
      await sync.watcher.stop();
      await sync.watcher.forceFlush();
      await sync.engine.stop();
    }
    const newSync = await startWorkspaceSync(
      updateParams.workspace,
      updateParams.agentId,
      pluginConfig,
      false,
      api.logger,
    );
    if (newSync) {
      activeSyncers.set(updateParams.workspace, newSync);
    }
    res.statusCode = 200;
    res.end(JSON.stringify({ success: true }));
    return true;
  });
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
            false, // Don't emit "add" events for existing files on startup (handled by initial scan)
            ctx.logger,
          );
          if (sync) {
            activeSyncers.set(workspace, sync);
          }
        } catch (err: any) {
          ctx.logger.warn(`[${agentId}] Failed to start sync: ${err.message}`);
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
        await sync.watcher.forceFlush();
        await sync.engine.stop();
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
            const result = await doInit(workspace);

            if (result.alreadyInitialized) {
              console.log(`Agent already initialized for ${agentId}.`);
              console.log(`Agent DID: ${result.agentDID}`);
              if (result.setupComplete) {
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

            console.log(`🔥 Agent initialized for ${agentId}!`);
            console.log(`Agent DID: ${result.agentDID}`);
            console.log("\nNext step — choose one:");
            console.log(
              `  New workspace:  openclaw clawracha setup <delegation> --agent ${agentId}`,
            );
            console.log(
              `  Join existing:  openclaw clawracha join <upload> <name> --agent ${agentId}`,
            );
          } catch (err: any) {
            console.error(`Error: ${err.message}`);
            if (err.stack) console.error(err.stack);
            process.exit(1);
          }
        });

      // --- setup ---
      clawracha
        .command("setup [delegation]")
        .description(
          "Set up a NEW workspace. Without args, logs into Storacha interactively. With <delegation>, uses a pre-created delegation.",
        )
        .requiredOption("--agent <id>", "Agent ID")
        .action(async (delegationArg: string | undefined, opts: { agent: string }) => {
          try {
            const { agentId, workspace } = requireAgent(opts.agent);

            const deviceConfig = await loadDeviceConfig(workspace);
            if (!deviceConfig?.agentKey) {
              console.error(
                `Run \`openclaw clawracha init --agent ${agentId}\` first.`,
              );
              process.exit(1);
            }

            let result;
            if (!delegationArg) {
              const { prompt } = await import("./prompts.js");
              const email = await prompt("Storacha email: ");
              const spaceName = await prompt("Space name: ");
              result = await doSetupWithLogin(
                workspace, agentId, email, spaceName, pluginConfig, config.gateway,
              );
            } else {
              result = await doSetup(
                workspace, agentId, delegationArg, pluginConfig, config.gateway,
              );
            }

            console.log(`🔥 Storacha workspace ready for ${agentId}!`);
            console.log(`Agent DID: ${result.agentDID}`);
            console.log(`Space: ${result.spaceDID ?? "unknown"}`);
            console.log(
              `\nTo add another device, run \`openclaw clawracha grant <their-DID> --agent ${agentId}\` here,`,
            );
            console.log(
              `then \`openclaw clawracha join <upload> <name> --agent <id>\` on the other device.`,
            );
            console.log("\nSync is now active (no gateway restart needed).");
          } catch (err: any) {
            console.error(`Error: ${err.message}`);
            if (err.stack) console.error(err.stack);
            if (err.cause?.stack) console.error("Caused by:", err.cause.stack);
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

              const result = await doJoin(
                workspace,
                agentId,
                uploadArg,
                nameArg,
                pluginConfig,
                config.gateway,
              );

              console.log(
                `🔥 Joined existing Storacha workspace for ${agentId}!`,
              );
              console.log(`Agent DID: ${result.agentDID}`);
              console.log(`Space: ${result.spaceDID ?? "unknown"}`);
              console.log(`Pulled ${result.pullCount} files from remote.`);
              console.log("\nSync is now active (no gateway restart needed).");
            } catch (err: any) {
              console.error(`Error: ${err.message}`);
              if (err.stack) console.error(err.stack);
              if (err.cause?.stack)
                console.error("Caused by:", err.cause.stack);
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
              const storachaClient = await createStorachaClient(deviceConfig);
              const audience = {
                did: () => targetDID as `did:${string}:${string}`,
              } as any;
              const uploadDel = await storachaClient.createDelegation(
                audience,
                Object.keys(spaceAccess),
                { expiration: Infinity },
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

            const agent = Agent.parse(deviceConfig.agentKey);

            let name;
            if (deviceConfig.nameArchive) {
              const archiveBytes = decodeDelegation(deviceConfig.nameArchive);
              name = await Name.extract(agent, archiveBytes);
            } else if (deviceConfig.nameDelegation) {
              const nameBytes = decodeDelegation(deviceConfig.nameDelegation);
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
            } else {
              results.push("⚠️ No name state available to grant from.");
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
          } catch (err: any) {
            console.error(`Error: ${err.message}`);
            if (err.stack) console.error(err.stack);
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
            if (err.stack) console.error(err.stack);
            process.exit(1);
          }
        });
      // --- inspect ---
      clawracha
        .command("inspect")
        .description("Inspect internal sync state for debugging")
        .requiredOption("--agent <id>", "Agent ID")
        .action(async (opts: { agent: string }) => {
          try {
            const { agentId, workspace } = requireAgent(opts.agent);

            const deviceConfig = await loadDeviceConfig(workspace);
            if (!deviceConfig?.agentKey || !deviceConfig.setupComplete) {
              console.log(
                `Not set up. Run \`openclaw clawracha init --agent ${agentId}\` first.`,
              );
              return;
            }

            // Use active syncer if available, otherwise spin up temporary engine
            let engine: SyncEngine;
            const activeSync = activeSyncers.get(workspace);
            if (activeSync) {
              engine = activeSync.engine;
            } else {
              engine = new SyncEngine(workspace);
              await engine.init(deviceConfig);
            }

            const state = await engine.inspect();

            console.log(`🔥 Storacha Inspect [${agentId}]`);
            console.log(`Workspace: ${workspace}`);
            console.log(`Running: ${state.running}`);
            console.log(`Root CID: ${state.root ?? "(none)"}`);
            console.log(`Revisions: ${state.revisions.length}`);
            for (const r of state.revisions) {
              console.log(`  event: ${r.event}`);
            }
            console.log(`\nPail entries (${state.pailKeys.length}):`);
            for (const key of state.pailKeys) {
              console.log(`  ${key}`);
            }
            console.log(`\nPending ops (${state.pendingOps.length}):`);
            for (const op of state.pendingOps) {
              console.log(
                `  ${op.type} ${op.key}${op.value ? ` → ${op.value}` : ""}`,
              );
            }
          } catch (err: any) {
            console.error(`Error: ${err.message}`);
            if (err.stack) console.error(err.stack);
            process.exit(1);
          }
        });

      // --- onboard ---
      clawracha
        .command("onboard")
        .description("Interactive guided setup for Storacha workspace sync")
        .requiredOption("--agent <id>", "Agent ID")
        .action(async (opts: { agent: string }) => {
          const { prompt, promptMultiline, choose } = await import("./prompts.js");

          try {
            const { agentId, workspace } = requireAgent(opts.agent);

            console.log(
              "🔥 Welcome to Clawracha — Storacha workspace sync!\n",
            );

            // Step 1: Init
            console.log("Step 1: Agent Identity");
            const initResult = await doInit(workspace);

            if (initResult.alreadyInitialized) {
              console.log("  Agent already initialized.");
              if (initResult.setupComplete) {
                console.log(
                  `  Setup is already complete! Use \`openclaw clawracha status --agent ${agentId}\` to check sync.\n`,
                );
                return;
              }
            } else {
              console.log("  ✅ Agent identity generated!");
            }
            console.log(`  Agent DID: ${initResult.agentDID}\n`);

            // Step 2: Path choice
            const choice = await choose(
              "Are you setting up a NEW workspace or JOINING an existing one?",
              ["NEW workspace", "JOIN existing"],
            );

            if (choice === "NEW workspace") {
              // --- Setup path ---
              console.log("\n📦 New Workspace Setup\n");

              const method = await choose(
                "How do you want to set up your space?",
                ["Login to Storacha", "Provide delegation from Storacha CLI"],
              );

              let result;
              if (method === "Login to Storacha") {
                const email = await prompt("Storacha email: ");
                const spaceName = await prompt("Space name: ");
                console.log("\n⏳ Setting up workspace...");
                result = await doSetupWithLogin(
                  workspace, agentId, email, spaceName, pluginConfig, config.gateway,
                );
              } else {
                console.log(
                  "You need a Storacha upload delegation for this agent.",
                );
                console.log("On a machine with the Storacha CLI, run:\n");
                console.log(
                  `  storacha delegation create ${initResult.agentDID} --base64\n`,
                );

                const delegationInput = await promptMultiline(
                  "Paste your upload delegation here:",
                );
                if (!delegationInput) {
                  console.error("No delegation provided. Aborting.");
                  process.exit(1);
                }

                console.log("\n⏳ Setting up workspace...");
                result = await doSetup(
                  workspace, agentId, delegationInput, pluginConfig, config.gateway,
                );
              }

              console.log(`\n🔥 Storacha workspace ready for ${agentId}!`);
              console.log(`  Agent DID: ${result.agentDID}`);
              console.log(`  Space: ${result.spaceDID ?? "unknown"}`);
              console.log("\nTo add another device, run:");
              console.log(
                `  openclaw clawracha grant <their-DID> --agent ${agentId}`,
              );
              console.log("\nSync is now active! 🎉");
            } else {
              // --- Join path ---
              console.log("\n🤝 Join Existing Workspace\n");
              console.log(
                "You need someone with access to grant you delegations.",
              );
              console.log("Ask them to run:\n");
              console.log(
                `  openclaw clawracha grant ${initResult.agentDID} --agent <their-agent-id>\n`,
              );
              console.log(
                "They'll get two delegations to share with you.\n",
              );

              const uploadInput = await promptMultiline(
                "Paste the upload delegation here:",
              );
              if (!uploadInput) {
                console.error("No upload delegation provided. Aborting.");
                process.exit(1);
              }

              const nameInput = await promptMultiline(
                "Paste the name delegation here:",
              );
              if (!nameInput) {
                console.error("No name delegation provided. Aborting.");
                process.exit(1);
              }

              console.log("\n⏳ Joining workspace...");
              const result = await doJoin(
                workspace,
                agentId,
                uploadInput,
                nameInput,
                pluginConfig,
                config.gateway,
              );

              console.log(
                `\n🔥 Joined Storacha workspace for ${agentId}!`,
              );
              console.log(`  Agent DID: ${result.agentDID}`);
              console.log(`  Space: ${result.spaceDID ?? "unknown"}`);
              console.log(
                `  Pulled ${result.pullCount} files from remote.`,
              );
              console.log("\nSync is now active! 🎉");
            }
          } catch (err: any) {
            console.error(`\n❌ Error: ${err.message}`);
            if (err.stack) console.error(err.stack);
            process.exit(1);
          }
        });
    },
    { commands: ["clawracha"] },
  );
}
