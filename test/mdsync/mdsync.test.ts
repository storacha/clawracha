import { describe, it, expect } from "vitest";
import { MemoryBlockstore } from "@storacha/ucn/block";
import * as Revision from "@storacha/ucn/pail/revision";
import * as Value from "@storacha/ucn/pail/value";
import { Block } from "multiformats";
import * as mdsync from "../../src/mdsync/index.js";

class TestBlockstore extends MemoryBlockstore {
  async putMany(blocks: Block[]) {
    for (const block of blocks) {
      await this.put(block);
    }
  }
}

const mockName = {} as any;

/** Helper: v0Put markdown, store block, create ValueView. */
async function initPail(blocks: TestBlockstore, key: string, md: string) {
  const block = await mdsync.v0Put(md);
  await blocks.put(block);
  const rev = await Revision.v0Put(blocks, key, block.cid);
  await blocks.putMany(rev.additions);
  await blocks.put(rev.revision.event);
  const { value } = await Value.from(blocks, mockName, rev.revision);
  return value;
}

/** Helper: put markdown update, store block, create new ValueView. */
async function updatePail(
  blocks: TestBlockstore,
  current: any,
  key: string,
  md: string,
) {
  const block = (await mdsync.put(blocks, current, key, md))!;
  await blocks.put(block);
  const rev = await Revision.put(blocks, current, key, block.cid);
  await blocks.putMany(rev.additions);
  await blocks.put(rev.revision.event);
  const { value } = await Value.from(blocks, mockName, rev.revision);
  return value;
}

describe("mdsync", () => {
  it("v0Put then get returns the markdown", async () => {
    const blocks = new TestBlockstore();
    const md = "# Hello\n\nThis is a test.\n";

    const value = await initPail(blocks, "test.md", md);
    const retrieved = await mdsync.get(blocks, value, "test.md");
    expect(retrieved).toBe(md);
  });

  it("put updates existing markdown", async () => {
    const blocks = new TestBlockstore();
    const md1 = "# Hello\n\nFirst version.\n";
    const md2 = "# Hello\n\nSecond version.\n";

    const v1 = await initPail(blocks, "test.md", md1);
    const v2 = await updatePail(blocks, v1, "test.md", md2);

    const retrieved = await mdsync.get(blocks, v2, "test.md");
    expect(retrieved).toBe(md2);
  });

  it("get returns undefined for missing key", async () => {
    const blocks = new TestBlockstore();
    const value = await initPail(blocks, "test.md", "# Hello\n");

    const retrieved = await mdsync.get(blocks, value, "missing.md");
    expect(retrieved).toBeUndefined();
  });

  it("multiple sequential puts", async () => {
    const blocks = new TestBlockstore();

    const v1 = await initPail(blocks, "doc.md", "# V1\n");
    const v2 = await updatePail(
      blocks,
      v1,
      "doc.md",
      "# V2\n\nNew paragraph.\n",
    );
    const v3 = await updatePail(
      blocks,
      v2,
      "doc.md",
      "# V3\n\nNew paragraph.\n\nAnother one.\n",
    );

    const retrieved = await mdsync.get(blocks, v3, "doc.md");
    expect(retrieved).toBe("# V3\n\nNew paragraph.\n\nAnother one.\n");
  });

  it("resolves concurrent edits from two heads", async () => {
    const blocks = new TestBlockstore();

    // Common ancestor
    const v0 = await initPail(blocks, "doc.md", "# Doc\n\nOriginal.\n");

    // Two concurrent edits branching from v0
    const block1 = (await mdsync.put(
      blocks,
      v0,
      "doc.md",
      "# Doc\n\nOriginal.\n\nFrom replica 1.\n",
    ))!;
    await blocks.put(block1);
    const rev1 = await Revision.put(blocks, v0, "doc.md", block1.cid);
    await blocks.putMany(rev1.additions);
    await blocks.put(rev1.revision.event);

    const block2 = (await mdsync.put(
      blocks,
      v0,
      "doc.md",
      "# Doc\n\nOriginal.\n\nFrom replica 2.\n",
    ))!;
    await blocks.put(block2);
    const rev2 = await Revision.put(blocks, v0, "doc.md", block2.cid);
    await blocks.putMany(rev2.additions);
    await blocks.put(rev2.revision.event);

    // Merge: ValueView with both heads
    const { value: merged } = await Value.from(
      blocks,
      mockName,
      rev1.revision,
      rev2.revision,
    );

    const result = await mdsync.get(blocks, merged, "doc.md");
    expect(result).toBeDefined();
    // Both edits should be present in the resolved document
    expect(result).toContain("From replica 1.");
    expect(result).toContain("From replica 2.");
  });

  it("resolves concurrent initial puts for a new key from two heads", async () => {
    const blocks = new TestBlockstore();

    // Bootstrap pail with a different key
    const v0 = await initPail(blocks, "bootstrap.md", "# Bootstrap\n");

    // Two concurrent puts for a NEW key "doc.md" that doesn't exist yet
    const block1 = (await mdsync.put(
      blocks,
      v0,
      "doc.md",
      "# Doc\n\nFrom replica 1.\n",
    ))!;
    await blocks.put(block1);
    const rev1 = await Revision.put(blocks, v0, "doc.md", block1.cid);
    await blocks.putMany(rev1.additions);
    await blocks.put(rev1.revision.event);

    const block2 = (await mdsync.put(
      blocks,
      v0,
      "doc.md",
      "# Doc\n\nFrom replica 2.\n",
    ))!;
    await blocks.put(block2);
    const rev2 = await Revision.put(blocks, v0, "doc.md", block2.cid);
    await blocks.putMany(rev2.additions);
    await blocks.put(rev2.revision.event);

    // Merge: ValueView with both heads
    const { value: merged } = await Value.from(
      blocks,
      mockName,
      rev1.revision,
      rev2.revision,
    );

    const result = await mdsync.get(blocks, merged, "doc.md");
    expect(result).toBeDefined();
    expect(result).toContain("From replica 1.");
    expect(result).toContain("From replica 2.");
  });
});
