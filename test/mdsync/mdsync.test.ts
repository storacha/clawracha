import { describe, it, expect } from "vitest";
import { MemoryBlockstore } from "@storacha/ucn/block";
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

describe("mdsync", () => {
  it("v0Put then get returns the markdown", async () => {
    const blocks = new TestBlockstore();
    const md = "# Hello\n\nThis is a test.\n";

    const result = await mdsync.v0Put(blocks, "test.md", md);
    await blocks.putMany(result.additions);
    const { value } = await Value.from(blocks, mockName, result.revision);

    const retrieved = await mdsync.get(blocks, value, "test.md");
    expect(retrieved).toBe(md);
  });

  it("put updates existing markdown", async () => {
    const blocks = new TestBlockstore();
    const md1 = "# Hello\n\nFirst version.\n";
    const md2 = "# Hello\n\nSecond version.\n";

    const r1 = await mdsync.v0Put(blocks, "test.md", md1);
    await blocks.putMany(r1.additions);
    const { value: v1 } = await Value.from(blocks, mockName, r1.revision);

    const r2 = await mdsync.put(blocks, v1, "test.md", md2);
    await blocks.putMany(r2.additions);
    const { value: v2 } = await Value.from(blocks, mockName, r2.revision);

    const retrieved = await mdsync.get(blocks, v2, "test.md");
    expect(retrieved).toBe(md2);
  });

  it("get returns undefined for missing key", async () => {
    const blocks = new TestBlockstore();
    const md = "# Hello\n";

    const result = await mdsync.v0Put(blocks, "test.md", md);
    await blocks.putMany(result.additions);
    const { value } = await Value.from(blocks, mockName, result.revision);

    const retrieved = await mdsync.get(blocks, value, "missing.md");
    expect(retrieved).toBeUndefined();
  });

  it("multiple sequential puts", async () => {
    const blocks = new TestBlockstore();

    const r1 = await mdsync.v0Put(blocks, "doc.md", "# V1\n");
    await blocks.putMany(r1.additions);
    const { value: v1 } = await Value.from(blocks, mockName, r1.revision);

    const r2 = await mdsync.put(blocks, v1, "doc.md", "# V2\n\nNew paragraph.\n");
    await blocks.putMany(r2.additions);
    const { value: v2 } = await Value.from(blocks, mockName, r2.revision);

    const r3 = await mdsync.put(blocks, v2, "doc.md", "# V3\n\nNew paragraph.\n\nAnother one.\n");
    await blocks.putMany(r3.additions);
    const { value: v3 } = await Value.from(blocks, mockName, r3.revision);

    const retrieved = await mdsync.get(blocks, v3, "doc.md");
    expect(retrieved).toBe("# V3\n\nNew paragraph.\n\nAnother one.\n");
  });
});
