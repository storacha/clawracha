/**
 * Tests for CLI commands:
 * - AC1:  clawracha init --dir <path> generates an agent identity in .storacha/config.json
 * - AC6:  clawracha status --dir <path> shows "Not initialized" on uninitialised dir
 * - AC7:  clawracha inspect --dir <path> shows "Not set up" on uninitialised dir
 * - AC9:  --dir defaults to cwd when not provided
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";

describe("doInit (AC1)", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "clawracha-cli-test-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("creates .storacha/config.json with an agentKey", async () => {
    const { doInit } = await import("../../src/commands.js");
    const result = await doInit(tmpDir);

    expect(result.alreadyInitialized).toBe(false);
    expect(result.setupComplete).toBe(false);
    expect(typeof result.agentKey).toBe("string");
    expect(result.agentKey.length).toBeGreaterThan(0);
    expect(result.agentDID).toMatch(/^did:key:z/);

    // Config file exists on disk with matching key
    const configPath = path.join(tmpDir, ".storacha", "config.json");
    const config = JSON.parse(await fs.readFile(configPath, "utf-8"));
    expect(config.agentKey).toBe(result.agentKey);
  });

  it("is idempotent — second init returns alreadyInitialized", async () => {
    const { doInit } = await import("../../src/commands.js");
    const first = await doInit(tmpDir);
    const second = await doInit(tmpDir);

    expect(second.alreadyInitialized).toBe(true);
    expect(second.agentKey).toBe(first.agentKey);
    expect(second.agentDID).toBe(first.agentDID);
  });
});

describe("status on uninitialised directory (AC6)", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "clawracha-cli-test-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("doStatus indicates workspace is not initialized", async () => {
    const { doStatus } = await import("../../src/commands.js");
    const result = await doStatus(tmpDir);

    expect(result.initialized).toBe(false);
    expect(result.message).toMatch(/[Nn]ot initialized/);
  });
});

describe("inspect on uninitialised directory (AC7)", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "clawracha-cli-test-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("doInspect indicates workspace is not set up", async () => {
    const { doInspect } = await import("../../src/commands.js");
    const result = await doInspect(tmpDir);

    expect(result.initialized).toBe(false);
    expect(result.message).toMatch(/[Nn]ot set up|[Nn]ot initialized/);
  });
});

describe("--dir defaults to cwd (AC9)", () => {
  it("resolveDir returns cwd when no path is given", async () => {
    const { resolveDir } = await import("../../src/cli.js");
    expect(resolveDir(undefined)).toBe(process.cwd());
  });

  it("resolveDir returns the provided path when given", async () => {
    const { resolveDir } = await import("../../src/cli.js");
    expect(resolveDir("/tmp/my-workspace")).toBe("/tmp/my-workspace");
  });
});
