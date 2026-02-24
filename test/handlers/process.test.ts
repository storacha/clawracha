import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";

import { Agent, Name, Revision } from "@storacha/ucn/pail";
import * as Value from "@storacha/ucn/pail/value";
import { MemoryBlockstore } from "@storacha/ucn/block";
import type { ValueView } from "@storacha/ucn/pail/api";
import type { Block } from "multiformats";

import { processChanges } from "../../src/handlers/process.js";
import type { FileChange } from "../../src/types/index.js";

// --- Helpers ---

const storeBlocks = async (
  store: MemoryBlockstore,
  blocks: Array<{ cid: unknown; bytes: Uint8Array }>,
) => {
  for (const block of blocks) {
    await store.put(block as any);
  }
};

/**
 * Create a block sink that collects blocks into an array.
 */
const makeBlockCollector = () => {
  const collected: Block[] = [];
  const sink = async (block: Block) => { collected.push(block); };
  return { sink, collected };
};

/**
 * Encode a file and extract root CID + blocks for bootstrapping pail state.
 */
const encodeFileForBootstrap = async (
  workspace: string,
  relativePath: string,
): Promise<{ rootCID: any; blocks: Block[] }> => {
  const { encodeWorkspaceFile } = await import("../../src/utils/encoder.js");
  const encoded = await encodeWorkspaceFile(workspace, relativePath);
  const blocks: Block[] = [];
  let rootCID: any = null;
  const reader = encoded.blocks.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    blocks.push(value);
    rootCID = value.cid; // last block is the root
  }
  return { rootCID, blocks };
};

/**
 * Bootstrap a pail value with entries, no clock needed.
 */
const bootstrapValue = async (
  blocks: MemoryBlockstore,
  entries: Record<string, string>,
): Promise<{ value: ValueView }> => {
  const agent = await Agent.generate();
  const name = await Name.create(agent);

  const keys = Object.keys(entries);
  if (keys.length === 0) throw new Error("need at least one entry");

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "bootstrap-"));
  for (const [key, content] of Object.entries(entries)) {
    const filePath = path.join(tmpDir, key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content);
  }

  const firstKey = keys[0];
  const firstEncoded = await encodeFileForBootstrap(tmpDir, firstKey);
  for (const b of firstEncoded.blocks) await blocks.put(b as any);

  const init = await Revision.v0Put(blocks, firstKey, firstEncoded.rootCID);
  await storeBlocks(blocks, init.additions);
  let value = (await Value.from(blocks, name, init.revision)).value;

  for (const key of keys.slice(1)) {
    const encoded = await encodeFileForBootstrap(tmpDir, key);
    for (const b of encoded.blocks) await blocks.put(b as any);

    const result = await Revision.put(blocks, value, key, encoded.rootCID);
    await storeBlocks(blocks, result.additions);
    value = (await Value.from(blocks, name, result.revision)).value;
  }

  await fs.rm(tmpDir, { recursive: true, force: true });
  return { value };
};

// --- Tests ---

describe("processChanges", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "clawracha-process-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  const writeFile = async (name: string, content: string) => {
    const filePath = path.join(tmpDir, name);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content);
  };

  it("no current + put → one put op", async () => {
    await writeFile("hello.txt", "hello world");
    const changes: FileChange[] = [{ type: "add", path: "hello.txt" }];

    const { sink, collected } = makeBlockCollector();
    const ops = await processChanges(changes, tmpDir, null, { get: async () => undefined }, sink, null);

    expect(ops).toHaveLength(1);
    expect(ops[0].type).toBe("put");
    expect(ops[0].key).toBe("hello.txt");
    expect(ops[0].value).toBeDefined();
    expect(collected.length).toBeGreaterThan(0);
  });

  it("no current + delete → no op", async () => {
    const changes: FileChange[] = [{ type: "unlink", path: "gone.txt" }];

    const { sink, collected } = makeBlockCollector();
    const ops = await processChanges(changes, tmpDir, null, { get: async () => undefined }, sink, null);

    expect(ops).toHaveLength(0);
    expect(collected).toHaveLength(0);
  });

  it("existing current + put new key → one put op", async () => {
    const blocks = new MemoryBlockstore();
    const { value } = await bootstrapValue(blocks, { "a.txt": "aaa" });

    await writeFile("b.txt", "bbb");
    const changes: FileChange[] = [{ type: "add", path: "b.txt" }];

    const { sink } = makeBlockCollector();
    const ops = await processChanges(changes, tmpDir, value, blocks, sink, null);

    expect(ops).toHaveLength(1);
    expect(ops[0].type).toBe("put");
    expect(ops[0].key).toBe("b.txt");
  });

  it("existing current + put same key different value → one put op", async () => {
    const blocks = new MemoryBlockstore();
    const { value } = await bootstrapValue(blocks, { "a.txt": "old content" });

    await writeFile("a.txt", "new content");
    const changes: FileChange[] = [{ type: "change", path: "a.txt" }];

    const { sink } = makeBlockCollector();
    const ops = await processChanges(changes, tmpDir, value, blocks, sink, null);

    expect(ops).toHaveLength(1);
    expect(ops[0].type).toBe("put");
    expect(ops[0].key).toBe("a.txt");
  });

  it("existing current + put same key same value → no op", async () => {
    const blocks = new MemoryBlockstore();
    const { value } = await bootstrapValue(blocks, { "a.txt": "same content" });

    await writeFile("a.txt", "same content");
    const changes: FileChange[] = [{ type: "change", path: "a.txt" }];

    const { sink, collected } = makeBlockCollector();
    const ops = await processChanges(changes, tmpDir, value, blocks, sink, null);

    expect(ops).toHaveLength(0);
    expect(collected.length).toBeGreaterThan(0);
  });

  it("existing current + delete existing key → one delete op", async () => {
    const blocks = new MemoryBlockstore();
    const { value } = await bootstrapValue(blocks, { "a.txt": "delete me" });

    const changes: FileChange[] = [{ type: "unlink", path: "a.txt" }];

    const { sink } = makeBlockCollector();
    const ops = await processChanges(changes, tmpDir, value, blocks, sink, null);

    expect(ops).toHaveLength(1);
    expect(ops[0].type).toBe("del");
    expect(ops[0].key).toBe("a.txt");
  });

  it("existing current + delete non-existing key → no op", async () => {
    const blocks = new MemoryBlockstore();
    const { value } = await bootstrapValue(blocks, { "a.txt": "keep me" });

    const changes: FileChange[] = [{ type: "unlink", path: "nonexistent.txt" }];

    const { sink } = makeBlockCollector();
    const ops = await processChanges(changes, tmpDir, value, blocks, sink, null);

    expect(ops).toHaveLength(0);
  });

  it("markdown file → mdsync v0Put (no current)", async () => {
    await writeFile("notes.md", "# Notes\n\nHello world.\n");
    const changes: FileChange[] = [{ type: "add", path: "notes.md" }];

    const { sink, collected } = makeBlockCollector();
    const ops = await processChanges(changes, tmpDir, null, { get: async () => undefined }, sink, null);

    expect(ops).toHaveLength(1);
    expect(ops[0].type).toBe("put");
    expect(ops[0].key).toBe("notes.md");
    expect(ops[0].value).toBeDefined();
    expect(collected.length).toBeGreaterThan(0);
  });

  it("markdown file update → mdsync put (with current)", async () => {
    const blocks = new MemoryBlockstore();
    // Bootstrap with a markdown file via mdsync
    const mdsync = await import("../../src/mdsync/index.js");
    const block = await mdsync.v0Put("# Old\n");
    await blocks.put(block);

    const { Agent, Name, Revision } = await import("@storacha/ucn/pail");
    const agent = await Agent.generate();
    const name = await Name.create(agent);
    const init = await Revision.v0Put(blocks, "readme.md", block.cid);
    await storeBlocks(blocks, init.additions);
    await blocks.put(init.revision.event as any);
    const { value } = await (await import("@storacha/ucn/pail/value")).from(blocks, name, init.revision);

    await writeFile("readme.md", "# New\n\nUpdated content.\n");
    const changes: FileChange[] = [{ type: "change", path: "readme.md" }];

    const { sink, collected } = makeBlockCollector();
    const ops = await processChanges(changes, tmpDir, value, blocks, sink, null);

    expect(ops).toHaveLength(1);
    expect(ops[0].type).toBe("put");
    expect(ops[0].key).toBe("readme.md");
    expect(collected.length).toBeGreaterThan(0);
  });

  it("mixed markdown and regular files", async () => {
    await writeFile("readme.md", "# Readme\n");
    await writeFile("data.txt", "some data");
    const changes: FileChange[] = [
      { type: "add", path: "readme.md" },
      { type: "add", path: "data.txt" },
    ];

    const { sink } = makeBlockCollector();
    const ops = await processChanges(changes, tmpDir, null, { get: async () => undefined }, sink, null);

    expect(ops).toHaveLength(2);
    const mdOp = ops.find((o) => o.key === "readme.md");
    const txtOp = ops.find((o) => o.key === "data.txt");
    expect(mdOp).toBeDefined();
    expect(mdOp!.type).toBe("put");
    expect(txtOp).toBeDefined();
    expect(txtOp!.type).toBe("put");
  });

  it("markdown delete → del op", async () => {
    const blocks = new MemoryBlockstore();
    const mdsync = await import("../../src/mdsync/index.js");
    const block = await mdsync.v0Put("# Delete me\n");
    await blocks.put(block);

    const { Agent, Name, Revision } = await import("@storacha/ucn/pail");
    const agent = await Agent.generate();
    const name = await Name.create(agent);
    const init = await Revision.v0Put(blocks, "delete.md", block.cid);
    await storeBlocks(blocks, init.additions);
    await blocks.put(init.revision.event as any);
    const { value } = await (await import("@storacha/ucn/pail/value")).from(blocks, name, init.revision);

    const changes: FileChange[] = [{ type: "unlink", path: "delete.md" }];
    const { sink } = makeBlockCollector();
    const ops = await processChanges(changes, tmpDir, value, blocks, sink, null);

    expect(ops).toHaveLength(1);
    expect(ops[0].type).toBe("del");
    expect(ops[0].key).toBe("delete.md");
  });
});
