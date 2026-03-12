#!/usr/bin/env node

/**
 * Standalone CLI entry point for Clawracha — Storacha workspace sync.
 *
 * Uses the same core command functions as the OpenClaw plugin but without
 * requiring the OpenClaw runtime. Uses --dir <path> (default: cwd) instead
 * of --agent <id>.
 */

import * as path from "node:path";
import { program } from "commander";
import * as fs from "node:fs/promises";
import {
  doInit,
  doStatus,
  doInspect,
  doSetup,
  doJoin,
  doGrant,
  doSyncForeground,
  loadDeviceConfig,
} from "./commands.js";
import { CID } from "multiformats/basics";
import { CAR } from "@ucanto/core";
import { identity } from "multiformats/hashes/identity";
import { base64 } from "multiformats/bases/base64";

export function resolveDir(dir: string | undefined): string {
  return dir ? path.resolve(dir) : process.cwd();
}

program
  .name("clawracha")
  .description("Storacha workspace sync")
  .option("--dir <path>", "Directory to sync (default: cwd)");

// --- init ---
program
  .command("init")
  .description("Generate an agent identity for Storacha sync")
  .action(async () => {
    const dir = resolveDir(program.opts().dir);
    try {
      const result = await doInit(dir);
      if (result.alreadyInitialized) {
        console.log("Agent already initialized.");
        console.log(`Agent DID: ${result.agentDID}`);
        if (result.setupComplete) {
          console.log("\nSetup is complete. Use `clawracha status` to check sync state.");
        } else {
          console.log("\nNext step — choose one:");
          console.log("  New workspace:  clawracha setup");
          console.log("  Join existing:  clawracha join <bundle>");
        }
      } else {
        console.log("🔥 Agent initialized!");
        console.log(`Agent DID: ${result.agentDID}`);
        console.log("\nNext step — choose one:");
        console.log("  New workspace:  clawracha setup");
        console.log("  Join existing:  clawracha join <bundle>");
      }
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });

// --- status ---
program
  .command("status")
  .description("Show Storacha sync status")
  .action(async () => {
    const dir = resolveDir(program.opts().dir);
    try {
      const result = await doStatus(dir);
      if (!result.initialized) {
        console.log(result.message);
        return;
      }
      console.log(`🔥 Storacha Sync Status`);
      console.log(`Workspace: ${dir}`);
      if (result.agentDID) console.log(`Agent DID: ${result.agentDID}`);
      if (result.spaceDID) console.log(`Space DID: ${result.spaceDID}`);
      console.log(`Upload delegation: ${result.uploadDelegation ? "✅" : "❌ not set"}`);
      console.log(`Name delegation: ${result.nameDelegation ? "✅" : "❌ not set"}`);
      console.log(`Plan delegation: ${result.planDelegation ? "✅" : "❌ not set"}`);
      console.log(`Access: ${result.accessType ?? "unknown"}`);
      console.log(`Name Archive: ${result.nameArchive ? "saved" : "not created"}`);
      console.log(`Setup complete: ${result.setupComplete ? "✅" : "❌"}`);
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });

// --- inspect ---
program
  .command("inspect")
  .description("Inspect internal sync state for debugging")
  .action(async () => {
    const dir = resolveDir(program.opts().dir);
    try {
      const result = await doInspect(dir);
      if (!result.initialized) {
        console.log(result.message);
        return;
      }
      const state = result.state!;
      console.log(`🔥 Storacha Inspect`);
      console.log(`Workspace: ${dir}`);
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
        console.log(`  ${op.type} ${op.key}${op.value ? ` → ${op.value}` : ""}`);
      }
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });

// --- sync ---
program
  .command("sync")
  .description("Start the file watcher + sync engine (runs in foreground until Ctrl+C)")
  .action(async () => {
    const dir = resolveDir(program.opts().dir);
    try {
      await doSyncForeground(dir, {});
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });

// --- setup ---
program
  .command("setup")
  .description("Set up a NEW workspace via Storacha login (creates space, generates delegations)")
  .action(async () => {
    const dir = resolveDir(program.opts().dir);
    try {
      const config = await loadDeviceConfig(dir);
      if (!config?.agentKey) {
        console.error("Run `clawracha init` first.");
        process.exit(1);
      }

      const { prompt } = await import("./prompts.js");
      const email = await prompt("Storacha email: ");
      const spaceName = await prompt("Space name: ");

      console.log("\n⏳ Setting up workspace...");
      const result = await doSetup(dir, "standalone", email, spaceName, {});

      console.log(`\n🔥 Storacha workspace ready!`);
      console.log(`Agent DID: ${result.agentDID}`);
      console.log(`Space: ${result.spaceDID ?? "unknown"}`);
      console.log("\nTo add another device, run `clawracha grant <their-DID>` here,");
      console.log("then `clawracha join <bundle>` on the other device.");
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });

// --- join ---
program
  .command("join <bundle>")
  .description("Join an existing workspace from another device. Bundle is a file path or base64 string from `grant`.")
  .action(async (bundleArg: string) => {
    const dir = resolveDir(program.opts().dir);
    try {
      const config = await loadDeviceConfig(dir);
      if (!config?.agentKey) {
        console.error("Run `clawracha init` first.");
        process.exit(1);
      }

      console.log("⏳ Joining workspace...");
      const result = await doJoin(dir, "standalone", bundleArg, {});

      console.log(`\n🔥 Joined Storacha workspace!`);
      console.log(`Agent DID: ${result.agentDID}`);
      console.log(`Space: ${result.spaceDID ?? "unknown"}`);
      console.log(`Pulled ${result.pullCount} files from remote.`);
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });

// --- grant ---
program
  .command("grant <target-DID>")
  .description("Grant another device access to this workspace (outputs a delegation bundle)")
  .option("-o, --output <file>", "Write bundle to file instead of base64 stdout")
  .action(async (targetDID: string, opts: { output?: string }) => {
    const dir = resolveDir(program.opts().dir);
    try {
      if (!targetDID.startsWith("did:")) {
        console.error("Error: target must be a DID (did:key:z...)");
        process.exit(1);
      }

      console.log("⏳ Creating delegation bundle...");
      const bundleBytes = await doGrant(dir, targetDID as `did:${string}:${string}`);

      if (opts.output) {
        await fs.writeFile(opts.output, bundleBytes);
        console.log(`\n🔥 Delegation bundle written to ${opts.output}`);
      } else {
        const idCid = CID.createV1(CAR.code, identity.digest(bundleBytes));
        console.log(`\n🔥 Delegation bundle for ${targetDID}:\n`);
        console.log(idCid.toString(base64));
      }

      console.log("\nThe target device should run:");
      console.log("  clawracha join <bundle>");
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });

// --- onboard ---
program
  .command("onboard")
  .description("Interactive guided setup for Storacha workspace sync")
  .action(async () => {
    const dir = resolveDir(program.opts().dir);
    try {
      const { prompt, promptMultiline, choose } = await import("./prompts.js");

      console.log("🔥 Welcome to Clawracha — Storacha workspace sync!\n");

      // Step 1: Init
      console.log("Step 1: Agent Identity");
      const initResult = await doInit(dir);

      if (initResult.alreadyInitialized) {
        console.log("  Agent already initialized.");
        if (initResult.setupComplete) {
          console.log("  Setup is already complete! Use `clawracha status` to check sync.\n");
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
        console.log("\n📦 New Workspace Setup\n");
        const email = await prompt("Storacha email: ");
        const spaceName = await prompt("Space name: ");

        console.log("\n⏳ Setting up workspace...");
        const result = await doSetup(dir, "standalone", email, spaceName, {});

        console.log(`\n🔥 Storacha workspace ready!`);
        console.log(`  Agent DID: ${result.agentDID}`);
        console.log(`  Space: ${result.spaceDID ?? "unknown"}`);
        console.log("\nTo add another device, run:");
        console.log("  clawracha grant <their-DID>");
        console.log("\nSync is now active! 🎉");
      } else {
        console.log("\n🤝 Join Existing Workspace\n");
        console.log("You need a delegation bundle from someone with access.");
        console.log("Ask them to run:\n");
        console.log(`  clawracha grant ${initResult.agentDID}\n`);

        const bundleInput = await promptMultiline("Paste the delegation bundle here:");
        if (!bundleInput) {
          console.error("No bundle provided. Aborting.");
          process.exit(1);
        }

        console.log("\n⏳ Joining workspace...");
        const result = await doJoin(dir, "standalone", bundleInput, {});

        console.log(`\n🔥 Joined Storacha workspace!`);
        console.log(`  Agent DID: ${result.agentDID}`);
        console.log(`  Space: ${result.spaceDID ?? "unknown"}`);
        console.log(`  Pulled ${result.pullCount} files from remote.`);
        console.log("\nSync is now active! 🎉");
      }
    } catch (err: any) {
      console.error(`\n❌ Error: ${err.message}`);
      process.exit(1);
    }
  });

// Only parse when run as a script, not when imported by tests.
// Check for Vitest env to avoid parsing during test imports.
if (!process.env["VITEST"]) {
  program.parse();
}
