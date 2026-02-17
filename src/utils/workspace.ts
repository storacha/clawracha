/**
 * Agent workspace resolution.
 *
 * Mirrors OpenClaw's resolveAgentWorkspaceDir logic from
 * src/agents/agent-scope.ts — resolves workspace dir for a given agent ID.
 */

import * as path from "node:path";
import * as os from "node:os";
import type { OpenClawConfig } from "openclaw/plugin-sdk";

/**
 * Resolve the workspace directory for an agent by ID.
 * Matches OpenClaw's resolution order:
 * 1. Agent-specific workspace from config
 * 2. For default agent: agents.defaults.workspace or ~/.openclaw/workspace
 * 3. For other agents: ~/.openclaw/workspace-{agentId}
 */
export function resolveAgentWorkspace(
  config: OpenClawConfig,
  agentId: string,
): string {
  const agent = config.agents?.list?.find(
    (a) => a.id.toLowerCase() === agentId.toLowerCase(),
  );

  // Agent-specific workspace
  if (agent?.workspace?.trim()) {
    return resolveUserPath(agent.workspace.trim());
  }

  // Default agent gets the default workspace
  const defaultId = resolveDefaultAgentId(config);
  if (agentId.toLowerCase() === defaultId.toLowerCase()) {
    const fallback = config.agents?.defaults?.workspace?.trim();
    if (fallback) {
      return resolveUserPath(fallback);
    }
    return path.join(resolveStateDir(), "workspace");
  }

  // Other agents: workspace-{id}
  return path.join(resolveStateDir(), `workspace-${agentId}`);
}

/**
 * Get all agent IDs from config.
 */
export function getAgentIds(config: OpenClawConfig): string[] {
  const list = config.agents?.list;
  if (!Array.isArray(list) || list.length === 0) {
    return ["default"];
  }
  return list
    .filter((a) => a && typeof a === "object" && a.id)
    .map((a) => a.id);
}

/**
 * Resolve the default agent ID from config.
 */
function resolveDefaultAgentId(config: OpenClawConfig): string {
  const list = config.agents?.list;
  if (!Array.isArray(list) || list.length === 0) {
    return "default";
  }
  const defaultAgent = list.find((a) => a.default);
  return (defaultAgent ?? list[0])?.id?.trim() || "default";
}

/**
 * Resolve OpenClaw state directory.
 */
function resolveStateDir(): string {
  return (
    process.env.OPENCLAW_STATE_DIR ||
    path.join(os.homedir(), ".openclaw")
  );
}

/**
 * Expand ~ in paths.
 */
function resolveUserPath(p: string): string {
  if (p.startsWith("~/")) {
    return path.join(os.homedir(), p.slice(2));
  }
  return p;
}
