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
import type { DeviceConfig, SyncPluginConfig } from "./types/index.js";
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
  // Capture plugin-specific config at registration time
  const pluginConfig = (api.pluginConfig ?? {}) as Partial<SyncPluginConfig>;

  // Register background service
  api.registerService({
    id: "storacha-sync",
    async start(ctx: OpenClawPluginServiceContext) {
      if (pluginConfig.enabled === false) {
        ctx.logger.info("Storacha sync disabled via config.");
        return;
      }

      workspaceDir = ctx.workspaceDir;
      const workspace = workspaceDir;
      if (!workspace) {
        ctx.logger.warn("No workspace directory configured");
        return;
      }

      const deviceConfig = await loadDeviceConfig(workspace);
      if (!deviceConfig || !deviceConfig.setupComplete) {
        ctx.logger.info(
          "Setup not complete. Run /storacha-init first, then /storacha-setup or /storacha-join.",
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
          watchPatterns: pluginConfig.watchPatterns ?? ["**/*"],
          ignorePatterns: pluginConfig.ignorePatterns ?? [
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

      await fileWatcher.start();
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
              text: "Sync not initialized. Run /storacha-init first, then /storacha-setup or /storacha-join.",
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
              text: "Sync not initialized. Run /storacha-init first, then /storacha-setup or /storacha-join.",
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
    description: "Generate an agent identity for Storacha sync",
    handler: async (_ctx) => {
      const workspace = workspaceDir;
      if (!workspace) return { text: "No workspace configured." };

      // Check if already initialized
      const existing = await loadDeviceConfig(workspace);
      if (existing?.agentKey) {
        const { Agent } = await import("@storacha/ucn/pail");
        const agent = Agent.parse(existing.agentKey);
        return {
          text: [
            "Agent already initialized.",
            `Agent DID: \`${agent.did()}\``,
            "",
            existing.setupComplete
              ? "Setup is complete. Use `/storacha-status` to check sync state."
              : "**Next step — choose one:**",
            ...(!existing.setupComplete
              ? [
                  "- **New workspace:** Have the space owner create an upload delegation for this DID, then run `/storacha-setup <upload-b64>`",
                  "- **Join existing:** Have the other device run `/storacha-grant <this-DID>`, then run `/storacha-join <upload-b64> <name-b64>`",
                ]
              : []),
          ].join("\n"),
        };
      }

      const { Agent } = await import("@storacha/ucn/pail");
      const agent = await Agent.generate();
      const agentKey = Agent.format(agent);

      const config: DeviceConfig = { agentKey };
      await saveDeviceConfig(workspace, config);

      return {
        text: [
          "\u{1f525} Agent initialized!",
          `Agent DID: \`${agent.did()}\``,
          "",
          "**Next step \u2014 choose one:**",
          "- **New workspace:** Have the space owner create an upload delegation for this DID, then run `/storacha-setup <upload-b64>`",
          "- **Join existing workspace:** Have the other device run `/storacha-grant <this-DID>`, then run `/storacha-join <upload-b64> <name-b64>`",
        ].join("\n"),
      };
    },
  });

  api.registerCommand({
    name: "storacha-setup",
    description:
      "Set up a NEW Storacha workspace (first device). Usage: /storacha-setup <upload-delegation-b64>",
    acceptsArgs: true,
    handler: async (_ctx) => {
      const workspace = workspaceDir;
      if (!workspace) return { text: "No workspace configured." };

      const config = await loadDeviceConfig(workspace);
      if (!config?.agentKey) {
        return { text: "Run `/storacha-init` first to generate an agent identity." };
      }

      if (config.setupComplete) {
        return { text: "Setup already complete. Use `/storacha-status` to check sync state." };
      }

      const b64 = _ctx.args?.trim();
      if (!b64) {
        return {
          text: [
            "Usage: `/storacha-setup <upload-delegation-b64>`",
            "",
            "This creates a **new** workspace. If you're joining an existing workspace, use `/storacha-join` instead.",
          ].join("\n"),
        };
      }

      // Validate delegation
      const bytes = Buffer.from(b64, "base64");
      const { ok: delegation, error } = await extractDelegation(bytes);
      if (!delegation) {
        return { text: `Invalid delegation: ${error}` };
      }

      const spaceDID = delegation.capabilities[0]?.with;

      config.uploadDelegation = b64;
      config.spaceDID = spaceDID ?? undefined;
      config.setupComplete = true;
      await saveDeviceConfig(workspace, config);

      const { Agent } = await import("@storacha/ucn/pail");
      const agent = Agent.parse(config.agentKey);

      return {
        text: [
          "\u{1f525} Storacha workspace ready!",
          `Agent DID: \`${agent.did()}\``,
          `Space: \`${spaceDID ?? "unknown"}\``,
          "",
          "Restart the gateway to start syncing.",
          "",
          "To add another device, run `/storacha-grant <their-agent-DID>` here,",
          "then `/storacha-join <upload-b64> <name-b64>` on the other device.",
        ].join("\n"),
      };
    },
  });

  api.registerCommand({
    name: "storacha-join",
    description:
      "Join an existing Storacha workspace from another device. Run /storacha-init first. Usage: /storacha-join <upload-delegation-b64> <name-delegation-b64>",
    acceptsArgs: true,
    handler: async (_ctx) => {
      const workspace = workspaceDir;
      if (!workspace) return { text: "No workspace configured." };

      const args = _ctx.args?.trim();
      if (!args) {
        return {
          text: [
            "Usage: `/storacha-join <upload-delegation-b64> <name-delegation-b64>`",
            "",
            "Get both delegations by running `/storacha-grant` on the existing device.",
            "If you're setting up a **new** workspace, use `/storacha-setup` instead.",
          ].join("\n"),
        };
      }

      const spaceIdx = args.indexOf(" ");
      if (spaceIdx === -1) {
        return {
          text: "Two arguments required: `/storacha-join <upload-b64> <name-b64>`",
        };
      }

      const uploadB64 = args.slice(0, spaceIdx).trim();
      const nameB64 = args.slice(spaceIdx + 1).trim();

      if (!uploadB64 || !nameB64) {
        return {
          text: "Two arguments required: `/storacha-join <upload-b64> <name-b64>`",
        };
      }

      // Validate upload delegation
      const uploadBytes = Buffer.from(uploadB64, "base64");
      const { ok: uploadDelegation, error: uploadErr } =
        await extractDelegation(uploadBytes);
      if (!uploadDelegation) {
        return { text: `Invalid upload delegation: ${uploadErr}` };
      }

      // Validate name delegation
      const nameBytes = Buffer.from(nameB64, "base64");
      const { ok: nameDelegation, error: nameErr } =
        await extractDelegation(nameBytes);
      if (!nameDelegation) {
        return { text: `Invalid name delegation: ${nameErr}` };
      }

      const config = await loadDeviceConfig(workspace);
      if (!config?.agentKey) {
        return { text: "Run `/storacha-init` first to generate an agent identity." };
      }

      if (config.setupComplete) {
        return { text: "Setup already complete. Use `/storacha-status` to check sync state." };
      }

      const { Agent } = await import("@storacha/ucn/pail");
      const agent = Agent.parse(config.agentKey);

      const spaceDID = uploadDelegation.capabilities[0]?.with;

      config.uploadDelegation = uploadB64;
      config.nameDelegation = nameB64;
      config.spaceDID = spaceDID ?? undefined;
      config.setupComplete = true;
      await saveDeviceConfig(workspace, config);

      // Pull remote state immediately before watcher starts
      let pullCount = 0;
      try {
        const storachaClient = await createStorachaClient(config);
        const engine = new SyncEngine(storachaClient, workspace);
        await engine.init(config);
        pullCount = await engine.pullRemote();

        // Save name archive after pull
        const nameArchive = await engine.exportNameArchive();
        config.nameArchive = nameArchive;
        await saveDeviceConfig(workspace, config);
      } catch (err: any) {
        return {
          text: [
            "\u26a0\ufe0f Delegations saved but initial pull failed:",
            `\`${err.message}\``,
            "",
            "Restart the gateway to retry.",
          ].join("\n"),
        };
      }

      return {
        text: [
          "\u{1f525} Joined existing Storacha workspace!",
          `Agent DID: \`${agent.did()}\``,
          `Space: \`${spaceDID ?? "unknown"}\``,
          `Pulled ${pullCount} files from remote.`,
          "",
          "Restart the gateway to start syncing.",
        ].join("\n"),
      };
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
        return {
          text: "Not initialized. Run `/storacha-init` first.",
        };
      }

      const results: string[] = [];

      // Re-delegate upload capability
      if (config.uploadDelegation) {
        try {
          const storachaClient = await createStorachaClient(config);
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
            results.push("**Upload delegation:**\n```\n" + b64 + "\n```");
          }
        } catch (err: any) {
          results.push(`\u274c Failed to create upload delegation: ${err.message}`);
        }
      } else {
        results.push("\u26a0\ufe0f No upload delegation to re-delegate.");
      }

      // Re-delegate name (pail sync) capability
      if (config.nameDelegation) {
        try {
          const { Agent, Name } = await import("@storacha/ucn/pail");
          const agent = Agent.parse(config.agentKey);

          let name;
          if (config.nameArchive) {
            const archiveBytes = Buffer.from(config.nameArchive, "base64");
            name = await Name.extract(agent, archiveBytes);
          } else {
            const nameBytes = Buffer.from(config.nameDelegation, "base64");
            const { ok: nameDel } = await extractDelegation(nameBytes);
            if (!nameDel) {
              results.push("\u274c Failed to extract name delegation.");
            } else {
              name = Name.from(agent, [nameDel]);
            }
          }

          if (name) {
            const nameDel = await name.grant(targetDID);
            const { ok: archiveBytes } = await nameDel.archive();
            if (archiveBytes) {
              const b64 = Buffer.from(archiveBytes).toString("base64");
              results.push("**Name delegation:**\n```\n" + b64 + "\n```");
            }
          }
        } catch (err: any) {
          results.push(`\u274c Failed to create name delegation: ${err.message}`);
        }
      } else {
        results.push("\u26a0\ufe0f No name delegation to re-delegate.");
      }

      if (results.length === 0) {
        return { text: "Nothing to grant. Set up this device first." };
      }

      return {
        text: [
          `\u{1f525} Delegations for \`${targetDID}\`:`,
          "",
          ...results,
          "",
          "The target device should run:",
          "`/storacha-join <upload-b64> <name-b64>`",
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
        return {
          text: "Not initialized. Run `/storacha-init` first.",
        };

      const lines = [
        "\u{1f525} Storacha Sync Status",
        `Agent: configured`,
        `Upload delegation: ${config.uploadDelegation ? "\u2705" : "\u274c not set"}`,
        `Name delegation: ${config.nameDelegation ? "\u2705" : "\u274c not set"}`,
        `Space DID: ${config.spaceDID ?? "unknown"}`,
        `Name Archive: ${config.nameArchive ? "saved" : "not created"}`,
        `Setup complete: ${config.setupComplete ? "\u2705" : "\u274c"}`,
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
