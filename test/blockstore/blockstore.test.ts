import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import { CID } from "multiformats/cid";
import { sha256 } from "multiformats/hashes/sha2";
import * as raw from "multiformats/codecs/raw";
import {
  MemoryBlockstore,
  DiskBlockstore,
  createWorkspaceBlockstore,
} from "../../src/blockstore/index.js";

const createTestBlock = async (content: string) => {
  const bytes = new TextEncoder().encode(content);
  const hash = await sha256.digest(bytes);
  const cid = CID.create(1, raw.code, hash);
  return { cid, bytes };
};

describe("MemoryBlockstore (from UCN)", () => {
  it("should store and retrieve blocks", async () => {
    const store = new MemoryBlockstore();
    const block = await createTestBlock("hello");

    await store.put(block);
    const retrieved = await store.get(block.cid);

    expect(retrieved).toBeDefined();
    expect(new Uint8Array(retrieved!.bytes)).toEqual(block.bytes);
  });

  it("should return undefined for missing blocks", async () => {
    const store = new MemoryBlockstore();
    const block = await createTestBlock("missing");

    const retrieved = await store.get(block.cid);
    expect(retrieved).toBeUndefined();
  });
});

describe("DiskBlockstore", () => {
  let tmpDir: string;
  let store: DiskBlockstore;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "clawracha-test-"));
    store = new DiskBlockstore(tmpDir);
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("should store and retrieve blocks", async () => {
    const block = await createTestBlock("disk-test");

    await store.put(block);
    const retrieved = await store.get(block.cid);

    expect(retrieved).toBeDefined();
    expect(new Uint8Array(retrieved!.bytes)).toEqual(block.bytes);
  });

  it("should persist blocks to disk", async () => {
    const block = await createTestBlock("persist-test");

    await store.put(block);

    const store2 = new DiskBlockstore(tmpDir);
    const retrieved = await store2.get(block.cid);

    expect(retrieved).toBeDefined();
    expect(new Uint8Array(retrieved!.bytes)).toEqual(block.bytes);
  });
});

describe("createWorkspaceBlockstore", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "clawracha-ws-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("should store and retrieve via tiered blockstore", async () => {
    const store = createWorkspaceBlockstore(tmpDir);
    const block = await createTestBlock("workspace-test");

    await store.put(block);
    const retrieved = await store.get(block.cid);

    expect(retrieved).toBeDefined();
    expect(new Uint8Array(retrieved!.bytes)).toEqual(block.bytes);
  });

  it("should persist to disk", async () => {
    const store = createWorkspaceBlockstore(tmpDir);
    const block = await createTestBlock("persist-ws-test");

    await store.put(block);

    // Verify on disk directly
    const disk = new DiskBlockstore(tmpDir);
    const retrieved = await disk.get(block.cid);

    expect(retrieved).toBeDefined();
    expect(new Uint8Array(retrieved!.bytes)).toEqual(block.bytes);
  });
});
