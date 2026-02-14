/**
 * OpenClaw Plugin Entry Point
 *
 * Registers:
 * - Background service for file watching and sync
 * - Agent tools for manual sync control
 * - Slash commands for setup
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { extract as extractDelegation } from "@storacha/client/delegation";
import type {
  OpenClawPluginApi,
  OpenClawPluginServiceContext,
  AnyAgentTool,
} from "openclaw/plugin-sdk";
import type { DeviceConfig } from "./types/index.js";
import { SyncEngine } from "./sync.js";
import { FileWatcher } from "./watcher.js";
import { createStorachaClient } from "./utils/client.js";

// Global state
let syncEngine: SyncEngine | null = null;
let fileWatcher: FileWatcher | null = null;
let workspaceDir: string | undefined;

/**
 * Load device config from .storacha/config.json
 */
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

/**
 * Save device config
 */
async function saveDeviceConfig(
  workspace: string,
  config: DeviceConfig,
): Promise<void> {
  const configDir = path.join(workspace, ".storacha");
  await fs.mkdir(configDir, { recursive: true });
  const configPath = path.join(configDir, "config.json");
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));
}

/**
 * Plugin entry — called by OpenClaw when the plugin is loaded.
 */
export default function plugin(api: OpenClawPluginApi) {
  // Register background service
  api.registerService({
    id: "storacha-sync",
    async start(ctx: OpenClawPluginServiceContext) {
      workspaceDir = ctx.workspaceDir;
      const workspace = workspaceDir;
      if (!workspace) {
        ctx.logger.warn("No workspace directory configured");
        return;
      }

      const deviceConfig = await loadDeviceConfig(workspace);
      if (!deviceConfig) {
        ctx.logger.info("No device config found. Run /storacha-init first.");
        return;
      }

      if (!deviceConfig.uploadDelegation) {
        ctx.logger.info(
          "No upload delegation. Run /storacha-delegate upload <b64> first.",
        );
        return;
      }

      const storachaClient = await createStorachaClient(deviceConfig);
      syncEngine = new SyncEngine(storachaClient, workspace);
      await syncEngine.init(deviceConfig);

      fileWatcher = new FileWatcher({
        workspace,
        config: {
          enabled: true,
          watchPatterns: ["**/*"],
          ignorePatterns: [
            ".storacha/**",
            "node_modules/**",
            ".git/**",
            "dist/**",
          ],
        },
        onChanges: async (changes) => {
          if (!syncEngine) return;
          await syncEngine.processChanges(changes);
          await syncEngine.sync();

          const nameArchive = await syncEngine.exportNameArchive();
          const updatedConfig = { ...deviceConfig, nameArchive };
          await saveDeviceConfig(workspace, updatedConfig);
        },
      });

      fileWatcher.start();
      ctx.logger.info("Started watching workspace");
    },

    async stop(ctx: OpenClawPluginServiceContext) {
      if (fileWatcher) {
        await fileWatcher.stop();
        fileWatcher = null;
      }
      syncEngine = null;
      ctx.logger.info("Stopped");
    },
  });

  // Register agent tools
  api.registerTool({
    name: "storacha_sync_status",
    label: "Storacha Sync Status",
    description: "Get the current Storacha workspace sync status",
    parameters: { type: "object", properties: {} } as any,
    execute: async () => {
      if (!syncEngine) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Sync not initialized. Run /storacha-init first.",
            },
          ],
          details: null,
        };
      }
      const status = await syncEngine.status();
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
    execute: async () => {
      if (!syncEngine) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Sync not initialized. Run /storacha-init first.",
            },
          ],
          details: null,
        };
      }
      await syncEngine.sync();
      const status = await syncEngine.status();
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

  // --- Slash Commands ---

  api.registerCommand({
    name: "storacha-init",
    description: "Initialize Storacha sync for this workspace",
    handler: async (_ctx) => {
      const workspace = workspaceDir;
      if (!workspace) return { text: "No workspace configured." };

      const { Agent } = await import("@storacha/ucn/pail");
      const agent = await Agent.generate();
      const agentKey = Agent.format(agent);

      const config: DeviceConfig = { agentKey };
      await saveDeviceConfig(workspace, config);

      return {
        text: [
          "🔥 Storacha sync initialized!",
          `Agent DID: \`${agent.did()}\``,
          "",
          "Next steps:",
          "1. Import upload delegation: `/storacha-delegate upload <base64>`",
          "2. Import name delegation: `/storacha-delegate name <base64>`",
          "",
          "Or have an existing device grant access: `/storacha-grant <this-agent-DID>`",
        ].join("\n"),
      };
    },
  });

  api.registerCommand({
    name: "storacha-delegate",
    description:
      "Import a delegation. Usage: /storacha-delegate <upload|name> <base64>",
    acceptsArgs: true,
    handler: async (_ctx) => {
      const workspace = workspaceDir;
      if (!workspace) return { text: "No workspace configured." };

      const args = _ctx.args?.trim();
      if (!args) {
        return {
          text: "Usage: `/storacha-delegate <upload|name> <base64>`",
        };
      }

      const spaceIdx = args.indexOf(" ");
      if (spaceIdx === -1) {
        return {
          text: "Usage: `/storacha-delegate <upload|name> <base64>`",
        };
      }

      const subcommand = args.slice(0, spaceIdx).toLowerCase();
      const b64 = args.slice(spaceIdx + 1).trim();

      if (subcommand !== "upload" && subcommand !== "name") {
        return {
          text: `Unknown subcommand \`${subcommand}\`. Use \`upload\` or \`name\`.`,
        };
      }

      if (!b64) {
        return { text: "Missing base64 delegation data." };
      }

      const config = await loadDeviceConfig(workspace);
      if (!config) {
        return { text: "Not initialized. Run `/storacha-init` first." };
      }

      // Validate the delegation can be extracted
      const bytes = Buffer.from(b64, "base64");
      const { ok: delegation, error } = await extractDelegation(bytes);
      if (!delegation) {
        return { text: `Invalid delegation: ${error}` };
      }

      if (subcommand === "upload") {
        config.uploadDelegation = b64;
        // Extract space DID from the delegation's resource
        const spaceDID = delegation.capabilities[0]?.with;
        if (spaceDID) {
          config.spaceDID = spaceDID;
        }
      } else {
        config.nameDelegation = b64;
      }

      await saveDeviceConfig(workspace, config);

      const status = [
        `✅ ${subcommand} delegation imported!`,
        "",
        `Upload delegation: ${config.uploadDelegation ? "✅" : "❌ missing"}`,
        `Name delegation: ${config.nameDelegation ? "✅" : "❌ missing"}`,
      ];

      if (config.uploadDelegation && config.nameDelegation) {
        status.push("", "Both delegations set. Restart the gateway to start syncing.");
      }

      return { text: status.join("\n") };
    },
  });

  api.registerCommand({
    name: "storacha-grant",
    description:
      "Grant another device access. Usage: /storacha-grant <target-DID>",
    acceptsArgs: true,
    handler: async (_ctx) => {
      const workspace = workspaceDir;
      if (!workspace) return { text: "No workspace configured." };

      const targetDID = _ctx.args?.trim() as `did:${string}:${string}`;
      if (!targetDID || !targetDID.startsWith("did:")) {
        return { text: "Usage: `/storacha-grant <did:key:z...>`" };
      }

      const config = await loadDeviceConfig(workspace);
      if (!config) {
        return { text: "Not initialized. Run `/storacha-init` first." };
      }

      const results: string[] = [];

      // Re-delegate upload capability
      if (config.uploadDelegation) {
        try {
          const storachaClient = await createStorachaClient(config);
          const { parse: parseDID } = await import("@ucanto/principal/ed25519");
          // createDelegation needs a Principal (just needs .did())
          const audience = { did: () => targetDID } as any;
          const uploadDelegation = await storachaClient.createDelegation(
            audience,
            [
              "space/blob/add",
              "space/index/add",
              "upload/add",
              "filecoin/offer",
            ],
          );
          const { ok: archiveBytes } = await uploadDelegation.archive();
          if (archiveBytes) {
            const b64 = Buffer.from(archiveBytes).toString("base64");
            results.push(`**Upload delegation:**\n\`\`\`\n${b64}\n\`\`\``);
          }
        } catch (err: any) {
          results.push(`❌ Failed to create upload delegation: ${err.message}`);
        }
      } else {
        results.push("⚠️ No upload delegation to re-delegate.");
      }

      // Re-delegate name (pail sync) capability
      if (config.nameDelegation) {
        try {
          const { Agent, Name } = await import("@storacha/ucn/pail");
          const agent = Agent.parse(config.agentKey);

          // Reconstruct the name from config
          let name;
          if (config.nameArchive) {
            const archiveBytes = Buffer.from(config.nameArchive, "base64");
            name = await Name.extract(agent, archiveBytes);
          } else {
            // Need the name delegation to reconstruct
            const nameBytes = Buffer.from(config.nameDelegation, "base64");
            const { ok: nameDelegation } =
              await extractDelegation(nameBytes);
            if (!nameDelegation) {
              results.push("❌ Failed to extract name delegation.");
            } else {
              name = Name.from(agent, [nameDelegation]);
            }
          }

          if (name) {
            const nameDelegation = await name.grant(targetDID);
            const { ok: archiveBytes } = await nameDelegation.archive();
            if (archiveBytes) {
              const b64 = Buffer.from(archiveBytes).toString("base64");
              results.push(`**Name delegation:**\n\`\`\`\n${b64}\n\`\`\``);
            }
          }
        } catch (err: any) {
          results.push(`❌ Failed to create name delegation: ${err.message}`);
        }
      } else {
        results.push("⚠️ No name delegation to re-delegate.");
      }

      if (results.length === 0) {
        return { text: "Nothing to grant. Import delegations first." };
      }

      return {
        text: [
          `🔥 Delegations for \`${targetDID}\`:`,
          "",
          ...results,
          "",
          "The target device should import these with:",
          "`/storacha-delegate upload <b64>`",
          "`/storacha-delegate name <b64>`",
        ].join("\n"),
      };
    },
  });

  api.registerCommand({
    name: "storacha-status",
    description: "Show Storacha sync status",
    handler: async (_ctx) => {
      const workspace = workspaceDir;
      if (!workspace) return { text: "No workspace configured." };

      const config = await loadDeviceConfig(workspace);
      if (!config)
        return { text: "Not initialized. Run /storacha-init first." };

      const lines = [
        "🔥 Storacha Sync Status",
        `Agent: configured`,
        `Upload delegation: ${config.uploadDelegation ? "✅" : "❌ not set"}`,
        `Name delegation: ${config.nameDelegation ? "✅" : "❌ not set"}`,
        `Space DID: ${config.spaceDID ?? "unknown"}`,
        `Name Archive: ${config.nameArchive ? "saved" : "not created"}`,
      ];

      if (syncEngine) {
        const status = await syncEngine.status();
        lines.push(
          `Running: ${status.running}`,
          `Last Sync: ${
            status.lastSync ? new Date(status.lastSync).toISOString() : "never"
          }`,
          `Entries: ${status.entryCount}`,
          `Pending: ${status.pendingChanges}`,
        );
      }

      return { text: lines.join("\n") };
    },
  });
}
