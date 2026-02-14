import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import * as http from "node:http";
import { CID } from "multiformats/cid";
import { sha256 } from "multiformats/hashes/sha2";
import * as raw from "multiformats/codecs/raw";

import { applyRemoteChanges } from "../../src/handlers/remote.js";

// --- Helpers ---

const createTestCID = async (content: string) => {
  const bytes = new TextEncoder().encode(content);
  const hash = await sha256.digest(bytes);
  return CID.create(1, raw.code, hash);
};

/**
 * Spin up a minimal mock IPFS gateway that returns file bytes for known CIDs.
 */
const createMockGateway = (
  files: Map<string, Uint8Array>,
): Promise<{ url: string; close: () => Promise<void> }> => {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const cidStr = req.url?.replace("/ipfs/", "");
      const data = cidStr ? files.get(cidStr) : undefined;
      if (data) {
        res.writeHead(200, { "Content-Type": "application/octet-stream" });
        res.end(data);
      } else {
        res.writeHead(404);
        res.end("Not Found");
      }
    });

    server.listen(0, "127.0.0.1", () => {
      const addr = server.address() as { port: number };
      resolve({
        url: `http://127.0.0.1:${addr.port}`,
        close: () => new Promise((r) => server.close(() => r())),
      });
    });
  });
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

  it("should fetch and write a new file from gateway", async () => {
    const content = new TextEncoder().encode("hello from storacha");
    const cid = await createTestCID("hello from storacha");

    const gateway = await createMockGateway(new Map([[cid.toString(), content]]));
    try {
      const entries = new Map<string, CID>([["docs/hello.txt", cid]]);
      await applyRemoteChanges(["docs/hello.txt"], entries, tmpDir, {
        gateway: gateway.url,
      });

      const written = await fs.readFile(path.join(tmpDir, "docs/hello.txt"));
      expect(new Uint8Array(written)).toEqual(content);
    } finally {
      await gateway.close();
    }
  });

  it("should overwrite an existing file with new content", async () => {
    // Write old content
    await fs.writeFile(path.join(tmpDir, "file.txt"), "old");

    const content = new TextEncoder().encode("new content");
    const cid = await createTestCID("new content");

    const gateway = await createMockGateway(new Map([[cid.toString(), content]]));
    try {
      const entries = new Map<string, CID>([["file.txt", cid]]);
      await applyRemoteChanges(["file.txt"], entries, tmpDir, {
        gateway: gateway.url,
      });

      const written = await fs.readFile(path.join(tmpDir, "file.txt"), "utf-8");
      expect(written).toBe("new content");
    } finally {
      await gateway.close();
    }
  });

  it("should delete a file that was removed remotely", async () => {
    const filePath = path.join(tmpDir, "delete-me.txt");
    await fs.writeFile(filePath, "goodbye");

    // Entry missing from map = deleted
    const entries = new Map<string, CID>();
    await applyRemoteChanges(["delete-me.txt"], entries, tmpDir);

    await expect(fs.access(filePath)).rejects.toThrow();
  });

  it("should not throw when deleting a file that doesn't exist", async () => {
    const entries = new Map<string, CID>();
    await expect(
      applyRemoteChanges(["nonexistent.txt"], entries, tmpDir),
    ).resolves.not.toThrow();
  });

  it("should create nested directories as needed", async () => {
    const content = new TextEncoder().encode("deep file");
    const cid = await createTestCID("deep file");

    const gateway = await createMockGateway(new Map([[cid.toString(), content]]));
    try {
      const entries = new Map<string, CID>([["a/b/c/deep.txt", cid]]);
      await applyRemoteChanges(["a/b/c/deep.txt"], entries, tmpDir, {
        gateway: gateway.url,
      });

      const written = await fs.readFile(path.join(tmpDir, "a/b/c/deep.txt"));
      expect(new Uint8Array(written)).toEqual(content);
    } finally {
      await gateway.close();
    }
  });

  it("should throw on gateway fetch failure", async () => {
    const cid = await createTestCID("missing");

    // Gateway with no files → 404
    const gateway = await createMockGateway(new Map());
    try {
      const entries = new Map<string, CID>([["fail.txt", cid]]);
      await expect(
        applyRemoteChanges(["fail.txt"], entries, tmpDir, {
          gateway: gateway.url,
        }),
      ).rejects.toThrow(/Gateway fetch failed/);
    } finally {
      await gateway.close();
    }
  });
});
