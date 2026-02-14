import { describe, it, expect } from "vitest";
import { CID } from "multiformats/cid";
import { sha256 } from "multiformats/hashes/sha2";
import * as raw from "multiformats/codecs/raw";
import {
  diffEntries,
  diffRemoteChanges,
  type PailEntries,
  type LocalEntries,
} from "../../src/utils/differ.js";

const createCID = async (content: string) => {
  const bytes = new TextEncoder().encode(content);
  const hash = await sha256.digest(bytes);
  return CID.create(1, raw.code, hash);
};

describe("diffEntries", () => {
  it("should detect new files", async () => {
    const local: LocalEntries = new Map([
      ["new.md", await createCID("new content")],
    ]);
    const pail: PailEntries = new Map();

    const ops = diffEntries(local, pail);

    expect(ops).toHaveLength(1);
    expect(ops[0].type).toBe("put");
    expect(ops[0].key).toBe("new.md");
  });

  it("should detect changed files", async () => {
    const cidOld = await createCID("old content");
    const cidNew = await createCID("new content");

    const local: LocalEntries = new Map([["file.md", cidNew]]);
    const pail: PailEntries = new Map([["file.md", cidOld]]);

    const ops = diffEntries(local, pail);

    expect(ops).toHaveLength(1);
    expect(ops[0].type).toBe("put");
    expect(ops[0].key).toBe("file.md");
  });

  it("should detect deleted files", async () => {
    const cid = await createCID("content");

    const local: LocalEntries = new Map();
    const pail: PailEntries = new Map([["deleted.md", cid]]);

    const ops = diffEntries(local, pail);

    expect(ops).toHaveLength(1);
    expect(ops[0].type).toBe("del");
    expect(ops[0].key).toBe("deleted.md");
  });

  it("should ignore unchanged files", async () => {
    const cid = await createCID("same content");

    const local: LocalEntries = new Map([["unchanged.md", cid]]);
    const pail: PailEntries = new Map([["unchanged.md", cid]]);

    const ops = diffEntries(local, pail);

    expect(ops).toHaveLength(0);
  });
});

describe("diffRemoteChanges", () => {
  it("should detect files added remotely", async () => {
    const cid = await createCID("remote file");

    const before: PailEntries = new Map();
    const after: PailEntries = new Map([["remote.md", cid]]);

    const changes = diffRemoteChanges(before, after);

    expect(changes).toEqual(["remote.md"]);
  });

  it("should detect files changed remotely", async () => {
    const cidOld = await createCID("old");
    const cidNew = await createCID("new");

    const before: PailEntries = new Map([["file.md", cidOld]]);
    const after: PailEntries = new Map([["file.md", cidNew]]);

    const changes = diffRemoteChanges(before, after);

    expect(changes).toEqual(["file.md"]);
  });
});
