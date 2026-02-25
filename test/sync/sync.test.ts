import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import { MemoryBlockstore } from "@storacha/ucn/block";
import { Agent, Name } from "@storacha/ucn/pail";
import { CID } from "multiformats/cid";
import { sha256 } from "multiformats/hashes/sha2";
import * as raw from "multiformats/codecs/raw";
import type { Block, Link } from "multiformats";
import { CarReader } from "@ipld/car";
import { Signer } from "@ucanto/principal/ed25519";
import { connect } from "@ucanto/client";
import * as CARCodec from "@ucanto/transport/car";
import { createServer, createService } from "@storacha/ucn/server";
import type { ClockConnection } from "@storacha/ucn/pail/api";

import { SyncEngine, SyncDeps } from "../../src/sync.js";
import type {
  StorageClient,
  Encoder,
  ContentFetcher,
  FileChange,
} from "../../src/types/index.js";
import type { WorkspaceBlockstore } from "../../src/blockstore/index.js";
import { HeadEvent, HeadStorage, NotFound } from "@storacha/ucn/server/api";

// --- Test Infrastructure ---

/**
 * Shared blockstore simulating the Storacha network.
 * uploadCAR writes here; peer blockstores fall back to reading here.
 */
class SharedNetwork extends MemoryBlockstore {}

/**
 * In-memory head storage for the local UCN clock server.
 */
function createHeadStore(): HeadStorage {
  const heads = new Map<string, HeadEvent[]>();
  return {
    get: async (clock: string) => {
      const h = heads.get(clock);
      if (!h) return { error: { name: "NotFound" as const } as NotFound };
      return { ok: h };
    },
    put: async (clock: string, head: HeadEvent[]) => {
      heads.set(clock, head);
      return { ok: {} };
    },
  };
}

/**
 * Create an in-memory UCN clock connection backed by the shared network.
 */
async function createLocalClockConnection(
  shared: SharedNetwork,
): Promise<ClockConnection> {
  const serverSigner = await Signer.generate();
  const service = createService({
    headStore: createHeadStore(),
    blockFetcher: shared,
    blockCache: shared,
  });
  const server = createServer(serverSigner, service);
  return connect({
    id: serverSigner,
    codec: CARCodec.outbound,
    channel: server,
  }) as unknown as ClockConnection;
}

/**
 * Per-peer blockstore: local MemoryBlockstore with fallback to shared network.
 * put() writes only to local. get() checks local first, then shared.
 */
function createTestBlockstore(shared: SharedNetwork): WorkspaceBlockstore {
  const local = new MemoryBlockstore();
  return {
    async get(cid: Link) {
      const block = await local.get(cid);
      if (block) return block;
      return shared.get(cid);
    },
    async put(block: Block) {
      await local.put(block);
    },
  } as WorkspaceBlockstore;
}

/**
 * Mock StorageClient: reads CAR bytes and writes blocks to shared network.
 */
function createTestClient(shared: SharedNetwork): StorageClient {
  return {
    async uploadCAR(car: { stream: () => ReadableStream }) {
      const stream = car.stream();
      const reader = stream.getReader();
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
      const bytes = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.length;
      }
      const carReader = await CarReader.fromBytes(bytes);
      for await (const block of carReader.blocks()) {
        await shared.put(block as unknown as Block);
      }
    },
  };
}

/**
 * Identity encoder: hash bytes as raw codec, return single block.
 */
const identityEncoder: Encoder = async (blob: Blob) => {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const hash = await sha256.digest(bytes);
  const cid = CID.create(1, raw.code, hash);
  const block = { cid, bytes } as unknown as Block;
  return new ReadableStream({
    start(controller) {
      controller.enqueue(block);
      controller.close();
    },
  });
};

/**
 * ContentFetcher that reads raw blocks from a blockstore.
 */
function createTestContentFetcher(blocks: WorkspaceBlockstore): ContentFetcher {
  return async (cid: CID): Promise<Uint8Array> => {
    const block = await blocks.get(cid);
    if (!block) throw new Error(`Block not found for CID ${cid}`);
    return block.bytes as Uint8Array;
  };
}

/**
 * Create a full test peer: SyncEngine + workspace dir.
 */
async function createTestPeer(
  shared: SharedNetwork,
  name: Awaited<ReturnType<typeof Name.create>>,
  remotes: ClockConnection[],
): Promise<{
  engine: SyncEngine;
  workspace: string;
  blocks: WorkspaceBlockstore;
}> {
  const workspace = await fs.mkdtemp(path.join(os.tmpdir(), "clawracha-sync-"));
  const blocks = createTestBlockstore(shared);
  const client = createTestClient(shared);
  const contentFetcher = createTestContentFetcher(blocks);

  const engine = new SyncEngine(workspace, {
    blocks,
    name,
    client,
    encoder: identityEncoder,
    contentFetcher,
    remotes,
  });

  return { engine, workspace, blocks };
}

// --- Helpers ---

async function writeFile(workspace: string, name: string, content: string) {
  const filePath = path.join(workspace, name);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content);
}

async function readFile(workspace: string, name: string): Promise<string> {
  return fs.readFile(path.join(workspace, name), "utf-8");
}

async function fileExists(workspace: string, name: string): Promise<boolean> {
  try {
    await fs.access(path.join(workspace, name));
    return true;
  } catch {
    return false;
  }
}

// --- Tests ---

describe("SyncEngine", () => {
  let shared: SharedNetwork;
  let workspaces: string[];

  beforeEach(() => {
    shared = new SharedNetwork();
    workspaces = [];
  });

  afterEach(async () => {
    for (const ws of workspaces) {
      await fs.rm(ws, { recursive: true, force: true });
    }
  });

  async function makePeer() {
    const agent = await Agent.generate();
    const name = await Name.create(agent);
    const clockConn = await createLocalClockConnection(shared);
    const remotes = [clockConn];
    const peer = await createTestPeer(shared, name, remotes);
    workspaces.push(peer.workspace);
    return peer;
  }

  async function makePeerPair() {
    const agent = await Agent.generate();
    const name = await Name.create(agent);
    const clockConn = await createLocalClockConnection(shared);
    const remotes = [clockConn];
    const peer1 = await createTestPeer(shared, name, remotes);
    const peer2 = await createTestPeer(shared, name, remotes);
    workspaces.push(peer1.workspace, peer2.workspace);
    return { peer1, peer2 };
  }

  it("start on empty workspace → no entries", async () => {
    const { engine } = await makePeer();
    await engine.start();

    const state = await engine.status();
    expect(state.running).toBe(true);
    expect(state.entryCount).toBe(0);
    expect(state.root).toBeNull();
  });

  it("processChanges + sync → file appears in pail", async () => {
    const { engine, workspace } = await makePeer();
    await engine.start();

    await writeFile(workspace, "hello.txt", "hello world");
    await engine.processChanges([{ type: "add", path: "hello.txt" }]);
    await engine.sync();

    const state = await engine.status();
    expect(state.entryCount).toBe(1);
    expect(state.pendingChanges).toBe(0);

    const inspect = await engine.inspect();
    expect(inspect.pailKeys).toContain("hello.txt");
  });

  it("sync propagates files between two peers", async () => {
    const { peer1, peer2 } = await makePeerPair();
    await peer1.engine.start();
    await peer2.engine.start();

    // Peer 1 writes and syncs
    await writeFile(peer1.workspace, "doc.txt", "from peer 1");
    await peer1.engine.processChanges([{ type: "add", path: "doc.txt" }]);
    await peer1.engine.sync();

    // Peer 2 syncs and should see the file
    await peer2.engine.sync();

    const content = await readFile(peer2.workspace, "doc.txt");
    expect(content).toBe("from peer 1");
  });

  it("both peers write different files → both converge", async () => {
    const { peer1, peer2 } = await makePeerPair();
    await peer1.engine.start();
    await peer2.engine.start();

    // Initialized both peers with a common file to ensure they have a shared root
    await writeFile(peer1.workspace, "start.txt", "start");
    await peer1.engine.processChanges([{ type: "add", path: "start.txt" }]);
    await peer1.engine.sync();
    await peer2.engine.sync();

    // Peer 2 writes file A and syncs
    await writeFile(peer1.workspace, "a.txt", "aaa");
    await peer1.engine.processChanges([{ type: "add", path: "a.txt" }]);
    await peer1.engine.sync();

    // Peer 2 writes file B and syncs
    await writeFile(peer2.workspace, "b.txt", "bbb");
    await peer2.engine.processChanges([{ type: "add", path: "b.txt" }]);
    await peer2.engine.sync();

    // Peer 1 syncs again to get B
    await peer1.engine.sync();

    // Both should have both files
    expect(await readFile(peer1.workspace, "a.txt")).toBe("aaa");
    expect(await readFile(peer1.workspace, "b.txt")).toBe("bbb");
    expect(await readFile(peer2.workspace, "a.txt")).toBe("aaa");
    expect(await readFile(peer2.workspace, "b.txt")).toBe("bbb");
  });

  it("file update → new content propagates", async () => {
    const { peer1, peer2 } = await makePeerPair();
    await peer1.engine.start();
    await peer2.engine.start();

    // Initial write
    await writeFile(peer1.workspace, "file.txt", "v1");
    await peer1.engine.processChanges([{ type: "add", path: "file.txt" }]);
    await peer1.engine.sync();
    await peer2.engine.sync();

    // Update
    await writeFile(peer1.workspace, "file.txt", "v2");
    await peer1.engine.processChanges([{ type: "change", path: "file.txt" }]);
    await peer1.engine.sync();
    await peer2.engine.sync();

    expect(await readFile(peer2.workspace, "file.txt")).toBe("v2");
  });

  it("file delete → removed on other peer", async () => {
    const { peer1, peer2 } = await makePeerPair();
    await peer1.engine.start();
    await peer2.engine.start();

    // Create file
    await writeFile(peer1.workspace, "gone.txt", "bye");
    await peer1.engine.processChanges([{ type: "add", path: "gone.txt" }]);
    await peer1.engine.sync();
    await peer2.engine.sync();
    expect(await fileExists(peer2.workspace, "gone.txt")).toBe(true);

    // Delete
    await fs.unlink(path.join(peer1.workspace, "gone.txt"));
    await peer1.engine.processChanges([{ type: "unlink", path: "gone.txt" }]);
    await peer1.engine.sync();
    await peer2.engine.sync();

    expect(await fileExists(peer2.workspace, "gone.txt")).toBe(false);
  });

  it("unchanged file → no duplicate ops", async () => {
    const { engine, workspace } = await makePeer();
    await engine.start();

    await writeFile(workspace, "stable.txt", "unchanged");
    await engine.processChanges([{ type: "add", path: "stable.txt" }]);
    await engine.sync();

    // Process same file again
    await engine.processChanges([{ type: "change", path: "stable.txt" }]);

    const inspect = await engine.inspect();
    expect(inspect.pendingOps).toHaveLength(0);
  });

  it("multiple files in one batch", async () => {
    const { engine, workspace } = await makePeer();
    await engine.start();

    await writeFile(workspace, "a.txt", "aaa");
    await writeFile(workspace, "b.txt", "bbb");
    await writeFile(workspace, "c.txt", "ccc");
    await engine.processChanges([
      { type: "add", path: "a.txt" },
      { type: "add", path: "b.txt" },
      { type: "add", path: "c.txt" },
    ]);
    await engine.sync();

    const state = await engine.status();
    expect(state.entryCount).toBe(3);
  });

  it("stop prevents sync", async () => {
    const { engine, workspace } = await makePeer();
    await engine.start();

    await writeFile(workspace, "test.txt", "data");
    await engine.processChanges([{ type: "add", path: "test.txt" }]);

    await engine.stop();
    await expect(engine.sync()).rejects.toThrow(/not running/);
  });

  it("markdown file round-trips between peers", async () => {
    const { peer1, peer2 } = await makePeerPair();
    await peer1.engine.start();
    await peer2.engine.start();

    await writeFile(peer1.workspace, "notes.md", "# Hello\n\nWorld.\n");
    await peer1.engine.processChanges([{ type: "add", path: "notes.md" }]);
    await peer1.engine.sync();
    await peer2.engine.sync();

    const content = await readFile(peer2.workspace, "notes.md");
    expect(content).toBe("# Hello\n\nWorld.\n");
  });

  it("nested directory structure syncs", async () => {
    const { peer1, peer2 } = await makePeerPair();
    await peer1.engine.start();
    await peer2.engine.start();

    await writeFile(peer1.workspace, "a/b/c/deep.txt", "deep content");
    await peer1.engine.processChanges([
      { type: "add", path: "a/b/c/deep.txt" },
    ]);
    await peer1.engine.sync();
    await peer2.engine.sync();

    expect(await readFile(peer2.workspace, "a/b/c/deep.txt")).toBe(
      "deep content",
    );
  });

  it("pullRemote writes all remote files locally", async () => {
    const { peer1, peer2 } = await makePeerPair();
    await peer1.engine.start();
    await peer2.engine.start();

    // Peer 1 adds several files
    await writeFile(peer1.workspace, "x.txt", "xxx");
    await writeFile(peer1.workspace, "y.txt", "yyy");
    await peer1.engine.processChanges([
      { type: "add", path: "x.txt" },
      { type: "add", path: "y.txt" },
    ]);
    await peer1.engine.sync();

    // Peer 2 pulls remote
    const count = await peer2.engine.pullRemote();
    expect(count).toBe(2);
    expect(await readFile(peer2.workspace, "x.txt")).toBe("xxx");
    expect(await readFile(peer2.workspace, "y.txt")).toBe("yyy");
  });
});
