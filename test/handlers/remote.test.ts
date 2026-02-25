import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import { CID } from "multiformats/cid";
import { sha256 } from "multiformats/hashes/sha2";
import * as raw from "multiformats/codecs/raw";

import { applyRemoteChanges } from "../../src/handlers/remote.js";
import type { ContentFetcher } from "../../src/types/index.js";

// --- Helpers ---

const createTestCID = async (content: string) => {
  const bytes = new TextEncoder().encode(content);
  const hash = await sha256.digest(bytes);
  return CID.create(1, raw.code, hash);
};

/**
 * Create a contentFetcher backed by a map of CID string → bytes.
 */
const makeMapContentFetcher = (
  files: Map<string, Uint8Array>,
): ContentFetcher => {
  return async (cid: CID): Promise<Uint8Array> => {
    const data = files.get(cid.toString());
    if (!data) throw new Error(`Content not found for CID ${cid}`);
    return data;
  };
};

// --- Tests ---

describe("applyRemoteChanges", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "clawracha-remote-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("should fetch and write a new file", async () => {
    const content = new TextEncoder().encode("hello from storacha");
    const cid = await createTestCID("hello from storacha");

    const contentFetcher = makeMapContentFetcher(
      new Map([[cid.toString(), content]]),
    );
    const entries = new Map<string, CID>([["docs/hello.txt", cid]]);
    await applyRemoteChanges(["docs/hello.txt"], entries, tmpDir, contentFetcher);

    const written = await fs.readFile(path.join(tmpDir, "docs/hello.txt"));
    expect(new Uint8Array(written)).toEqual(content);
  });

  it("should overwrite an existing file with new content", async () => {
    await fs.writeFile(path.join(tmpDir, "file.txt"), "old");

    const content = new TextEncoder().encode("new content");
    const cid = await createTestCID("new content");

    const contentFetcher = makeMapContentFetcher(
      new Map([[cid.toString(), content]]),
    );
    const entries = new Map<string, CID>([["file.txt", cid]]);
    await applyRemoteChanges(["file.txt"], entries, tmpDir, contentFetcher);

    const written = await fs.readFile(path.join(tmpDir, "file.txt"), "utf-8");
    expect(written).toBe("new content");
  });

  it("should delete a file that was removed remotely", async () => {
    const filePath = path.join(tmpDir, "delete-me.txt");
    await fs.writeFile(filePath, "goodbye");

    const entries = new Map<string, CID>();
    const contentFetcher = makeMapContentFetcher(new Map());
    await applyRemoteChanges(["delete-me.txt"], entries, tmpDir, contentFetcher);

    await expect(fs.access(filePath)).rejects.toThrow();
  });

  it("should not throw when deleting a file that doesn't exist", async () => {
    const entries = new Map<string, CID>();
    const contentFetcher = makeMapContentFetcher(new Map());
    await expect(
      applyRemoteChanges(["nonexistent.txt"], entries, tmpDir, contentFetcher),
    ).resolves.not.toThrow();
  });

  it("should create nested directories as needed", async () => {
    const content = new TextEncoder().encode("deep file");
    const cid = await createTestCID("deep file");

    const contentFetcher = makeMapContentFetcher(
      new Map([[cid.toString(), content]]),
    );
    const entries = new Map<string, CID>([["a/b/c/deep.txt", cid]]);
    await applyRemoteChanges(["a/b/c/deep.txt"], entries, tmpDir, contentFetcher);

    const written = await fs.readFile(path.join(tmpDir, "a/b/c/deep.txt"));
    expect(new Uint8Array(written)).toEqual(content);
  });

  it("should throw when content is not found", async () => {
    const cid = await createTestCID("missing");

    const contentFetcher = makeMapContentFetcher(new Map());
    const entries = new Map<string, CID>([["fail.txt", cid]]);
    await expect(
      applyRemoteChanges(["fail.txt"], entries, tmpDir, contentFetcher),
    ).rejects.toThrow(/Content not found/);
  });

  it("should resolve markdown file via mdsync instead of contentFetcher", async () => {
    const { MemoryBlockstore } = await import("@storacha/ucn/block");
    const { Agent, Name, Revision } = await import("@storacha/ucn/pail");
    const Value = await import("@storacha/ucn/pail/value");
    const mdsync = await import("../../src/mdsync/index.js");
    const { makeEncoder } = await import("../../src/utils/encoder.js");

    const blocks = new MemoryBlockstore();
    const md = "# Remote Doc\n\nFrom another device.\n";
    const mdBlock = await mdsync.v0Put(md);

    // Encode through UnixFS encoder (like processChanges does)
    const encoder = makeEncoder(null);
    const encStream = await encoder(
      new Blob([mdBlock.bytes as Uint8Array<ArrayBuffer>]),
    );
    const encBlocks: any[] = [];
    let rootCID: any = null;
    const reader = (encStream as ReadableStream).getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      encBlocks.push(value);
      rootCID = value.cid;
    }
    for (const b of encBlocks) await blocks.put(b as any);
    await blocks.put(mdBlock);

    const agent = await Agent.generate();
    const name = await Name.create(agent);
    const rev = await Revision.v0Put(blocks, "doc.md", rootCID);
    for (const b of rev.additions) await blocks.put(b as any);
    await blocks.put(rev.revision.event as any);
    const { value } = await Value.from(blocks, name, rev.revision);

    // contentFetcher that reads UnixFS from the blockstore
    const contentFetcher: ContentFetcher = async (cid: CID) => {
      const { exporter } = await import("ipfs-unixfs-exporter");
      const entry = await exporter(cid, {
        get: async (c: CID) => {
          const block = await blocks.get(c);
          if (!block) throw new Error(`Block not found: ${c}`);
          return block.bytes as Uint8Array;
        },
      });
      if (entry.type !== "file" && entry.type !== "raw") {
        throw new Error(`Unexpected entry type: ${entry.type}`);
      }
      const chunks: Uint8Array[] = [];
      for await (const chunk of entry.content()) chunks.push(chunk);
      return Buffer.concat(chunks);
    };

    const entries = new Map<string, CID>([
      ["doc.md", rootCID as unknown as CID],
    ]);
    await applyRemoteChanges(["doc.md"], entries, tmpDir, contentFetcher, {
      blocks,
      current: value,
    });

    const written = await fs.readFile(path.join(tmpDir, "doc.md"), "utf-8");
    expect(written).toBe(md);
  });
});
