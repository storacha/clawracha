import { describe, it, expect } from "vitest";
import * as mdsync from "../../src/mdsync/index.js";

describe("mdsync encode/decode round-trip", () => {
  it("v0Put block round-trips through encode/decode", async () => {
    const md = "# Hello\n\nThis is a test.\n";
    const block = await mdsync.v0Put(md);

    // Decode the block back to a DeserializedMarkdownEntry
    const entry = await mdsync.decodeMarkdownEntry(block);
    expect(entry.type).toBe("initial");
    expect(entry.root).toBeDefined();
    expect(entry.events).toBeDefined();

    // Re-encode should produce identical bytes
    const reencoded = await mdsync.encodeMarkdownEntry(entry);
    expect(reencoded.cid.toString()).toBe(block.cid.toString());
    expect(reencoded.bytes).toEqual(block.bytes);
  });

  it("re-encoding a decoded entry produces same CID", async () => {
    const block = await mdsync.v0Put("# Same\n");
    const entry = await mdsync.decodeMarkdownEntry(block);
    const reencoded = await mdsync.encodeMarkdownEntry(entry);

    // Decode → re-encode should be identity
    expect(reencoded.cid.toString()).toBe(block.cid.toString());
  });

  it("different content produces different CIDs", async () => {
    const block1 = await mdsync.v0Put("# One\n");
    const block2 = await mdsync.v0Put("# Two\n");

    expect(block1.cid.toString()).not.toBe(block2.cid.toString());
  });
});
