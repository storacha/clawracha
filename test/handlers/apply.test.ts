import { describe, it, expect, beforeEach } from "vitest";
import { CID } from "multiformats/cid";
import { sha256 } from "multiformats/hashes/sha2";
import * as raw from "multiformats/codecs/raw";
import { connect } from "@ucanto/client";
import * as CAR from "@ucanto/transport/car";
import * as ed25519 from "@ucanto/principal/ed25519";

import { Agent, Name, Revision } from "@storacha/ucn/pail";
import type { ClockConnection, ValueView } from "@storacha/ucn/pail/api";
import { MemoryBlockstore } from "@storacha/ucn/block";
import { createServer, createService } from "@storacha/ucn/server";
import type { HeadEvent } from "@storacha/ucn/server/api";
import { applyPendingOps } from "../../src/handlers/apply.js";
import type { PailOp } from "../../src/types/index.js";
import { Block } from "@ucanto/interface";

// --- Helpers ---

const createTestCID = async (content: string) => {
  const bytes = new TextEncoder().encode(content);
  const hash = await sha256.digest(bytes);
  return CID.create(1, raw.code, hash);
};

class MemoryHeadStorage {
  heads: Record<string, HeadEvent[]> = {};

  async get(clock: string) {
    return this.heads[clock]
      ? { ok: this.heads[clock] }
      : { error: { name: "NotFound" as const, message: "Clock not found" } };
  }

  async put(clock: string, head: HeadEvent[]) {
    this.heads[clock] = head;
    return { ok: {} };
  }
}

const storeBlocks = async (store: MemoryBlockstore, blocks: Array<Block>) => {
  for (const block of blocks) {
    await store.put(block);
  }
};

/**
 * Create a mock clock server and return a ClockConnection for it.
 * Shared headStore + blockCache allow multiple agents to sync.
 */
const createTestEnv = async (sharedBlocks?: MemoryBlockstore) => {
  const headStore = new MemoryHeadStorage();
  const blockCache = sharedBlocks ?? new MemoryBlockstore();
  const serviceId = await ed25519.generate();

  const service = createService({
    headStore: headStore,
    blockFetcher: blockCache,
    blockCache,
  });

  const server = createServer(serviceId, service);
  const remote = connect({
    id: serviceId,
    codec: CAR.outbound,
    channel: server,
  }) as unknown as ClockConnection;

  return { remote, headStore, blockCache };
};

/**
 * Read all entries from a pail value.
 */
const getEntries = async (
  blocks: MemoryBlockstore,
  value: ValueView,
): Promise<Map<string, string>> => {
  const entries = new Map<string, string>();
  for await (const [key, val] of Revision.entries(blocks, value)) {
    entries.set(key, (val as CID).toString());
  }
  return entries;
};

// --- Tests ---

describe("applyPendingOps", () => {
  let blocks: MemoryBlockstore;
  let remote: ClockConnection;

  beforeEach(async () => {
    blocks = new MemoryBlockstore();
    const env = await createTestEnv();
    remote = env.remote;
  });

  it("should handle a single put on an empty pail", async () => {
    const agent = await Agent.generate();
    const name = await Name.create(agent);
    const cid = await createTestCID("file-a");

    const ops: PailOp[] = [{ type: "put", key: "docs/readme.md", value: cid }];

    const result = await applyPendingOps(blocks, name, null, ops, {
      remotes: [remote],
    });

    expect(result.current).not.toBeNull();
    expect(result.revisionBlocks.length).toBeGreaterThan(0);

    // Store blocks so we can read entries
    await storeBlocks(blocks, result.revisionBlocks);

    const entries = await getEntries(blocks, result.current!);
    expect(entries.size).toBe(1);
    expect(entries.get("docs/readme.md")).toBe(cid.toString());
  });

  it("should handle multiple puts on an empty pail", async () => {
    const agent = await Agent.generate();
    const name = await Name.create(agent);
    const cidA = await createTestCID("file-a");
    const cidB = await createTestCID("file-b");
    const cidC = await createTestCID("file-c");

    const ops: PailOp[] = [
      { type: "put", key: "a.txt", value: cidA },
      { type: "put", key: "b.txt", value: cidB },
      { type: "put", key: "c.txt", value: cidC },
    ];

    const result = await applyPendingOps(blocks, name, null, ops, {
      remotes: [remote],
    });

    expect(result.current).not.toBeNull();
    await storeBlocks(blocks, result.revisionBlocks);

    const entries = await getEntries(blocks, result.current!);
    expect(entries.size).toBe(3);
    expect(entries.get("a.txt")).toBe(cidA.toString());
    expect(entries.get("b.txt")).toBe(cidB.toString());
    expect(entries.get("c.txt")).toBe(cidC.toString());
  });

  it("should handle puts and dels on an existing value", async () => {
    const agent = await Agent.generate();
    const name = await Name.create(agent);

    // Bootstrap with initial entries
    const cidA = await createTestCID("file-a");
    const cidB = await createTestCID("file-b");
    const init = await applyPendingOps(
      blocks,
      name,
      null,
      [
        { type: "put", key: "a.txt", value: cidA },
        { type: "put", key: "b.txt", value: cidB },
      ],
      { remotes: [remote] },
    );
    await storeBlocks(blocks, init.revisionBlocks);

    // Now apply mixed ops: add c.txt, delete a.txt
    const cidC = await createTestCID("file-c");
    const result = await applyPendingOps(
      blocks,
      name,
      init.current,
      [
        { type: "put", key: "c.txt", value: cidC },
        { type: "del", key: "a.txt" },
      ],
      { remotes: [remote] },
    );

    expect(result.current).not.toBeNull();
    await storeBlocks(blocks, result.revisionBlocks);

    const entries = await getEntries(blocks, result.current!);
    expect(entries.size).toBe(2);
    expect(entries.has("a.txt")).toBe(false);
    expect(entries.get("b.txt")).toBe(cidB.toString());
    expect(entries.get("c.txt")).toBe(cidC.toString());
  });

  it("should return null current when no ops and no current", async () => {
    const agent = await Agent.generate();
    const name = await Name.create(agent);

    const result = await applyPendingOps(blocks, name, null, [], {
      remotes: [remote],
    });

    expect(result.current).toBeNull();
    expect(result.revisionBlocks).toEqual([]);
  });

  it("should converge when two agents publish concurrently", async () => {
    const sharedBlocks = new MemoryBlockstore();
    const env = await createTestEnv(sharedBlocks);

    const agentA = await Agent.generate();
    const nameA = await Name.create(agentA);

    const agentB = await Agent.generate();
    const proof = await Name.grant(nameA, agentB.did());
    const nameB = Name.from(agentB, [proof]);

    const cid1 = await createTestCID("file-1");
    const cid2 = await createTestCID("file-2");
    const cid3 = await createTestCID("file-3");

    // Step 1: Agent A puts first key
    const resultA1 = await applyPendingOps(
      sharedBlocks,
      nameA,
      null,
      [{ type: "put", key: "one.txt", value: cid1 }],
      { remotes: [env.remote] },
    );
    await storeBlocks(sharedBlocks, resultA1.revisionBlocks);

    // Step 2: Agent B resolves to get A's value
    const resolveB1 = await Revision.resolve(sharedBlocks, nameB, {
      remotes: [env.remote],
    });
    await storeBlocks(sharedBlocks, resolveB1.additions);
    let currentB = resolveB1.value;

    // Step 3: Agent A puts second key
    const resultA2 = await applyPendingOps(
      sharedBlocks,
      nameA,
      resultA1.current,
      [{ type: "put", key: "two.txt", value: cid2 }],
      { remotes: [env.remote] },
    );
    await storeBlocks(sharedBlocks, resultA2.revisionBlocks);

    // Step 4: Agent B (still on old value) puts third key and applies
    const resultB = await applyPendingOps(
      sharedBlocks,
      nameB,
      currentB,
      [{ type: "put", key: "three.txt", value: cid3 }],
      { remotes: [env.remote] },
    );
    await storeBlocks(sharedBlocks, resultB.revisionBlocks);

    // Agent B should see all three keys
    const entriesB = await getEntries(sharedBlocks, resultB.current!);
    expect(entriesB.size).toBe(3);
    expect(entriesB.get("one.txt")).toBe(cid1.toString());
    expect(entriesB.get("two.txt")).toBe(cid2.toString());
    expect(entriesB.get("three.txt")).toBe(cid3.toString());

    // Step 5: Agent A resolves — should also see all three keys
    const resolveA = await Revision.resolve(sharedBlocks, nameA, {
      base: resultA2.current ?? undefined,
      remotes: [env.remote],
    });
    await storeBlocks(sharedBlocks, resolveA.additions);

    const entriesA = await getEntries(sharedBlocks, resolveA.value);
    expect(entriesA.size).toBe(3);
    expect(entriesA.get("one.txt")).toBe(cid1.toString());
    expect(entriesA.get("two.txt")).toBe(cid2.toString());
    expect(entriesA.get("three.txt")).toBe(cid3.toString());

    // Both agents should have converged to the same root
    expect(resolveA.value.root.toString()).toBe(resultB.current!.root.toString());
  });
});
