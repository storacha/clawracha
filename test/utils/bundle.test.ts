import { describe, it, expect } from "vitest";
import {
  createDelegationBundle,
  extractDelegationBundle,
} from "../../src/utils/bundle.js";

describe("delegation bundle", () => {
  it("round-trips three delegation byte arrays", async () => {
    const upload = new Uint8Array([1, 2, 3, 4, 5]);
    const name = new Uint8Array([10, 20, 30]);
    const plan = new Uint8Array([100, 200, 255, 0, 42]);

    const carBytes = await createDelegationBundle({ upload, name, plan });
    expect(carBytes).toBeInstanceOf(Uint8Array);
    expect(carBytes.length).toBeGreaterThan(0);

    const extracted = await extractDelegationBundle(carBytes);
    expect(new Uint8Array(extracted.upload)).toEqual(upload);
    expect(new Uint8Array(extracted.name)).toEqual(name);
    expect(new Uint8Array(extracted.plan)).toEqual(plan);
  });

  it("round-trips large delegation byte arrays", async () => {
    const upload = new Uint8Array(10000).fill(0xab);
    const name = new Uint8Array(5000).fill(0xcd);
    const plan = new Uint8Array(8000).fill(0xef);

    const carBytes = await createDelegationBundle({ upload, name, plan });
    const extracted = await extractDelegationBundle(carBytes);

    expect(new Uint8Array(extracted.upload)).toEqual(upload);
    expect(new Uint8Array(extracted.name)).toEqual(name);
    expect(new Uint8Array(extracted.plan)).toEqual(plan);
  });

  it("rejects CAR with missing keys", async () => {
    // Create a valid CAR but with wrong keys
    const { encode } = await import("multiformats/block");
    const cbor = await import("@ipld/dag-cbor");
    const { sha256 } = await import("multiformats/hashes/sha2");
    const { CarWriter } = await import("@ipld/car/writer");

    const rootBlock = await encode({
      value: { upload: new Uint8Array([1]), wrong: new Uint8Array([2]) },
      codec: cbor,
      hasher: sha256,
    });

    const { writer, out } = CarWriter.create([rootBlock.cid]);
    const chunks: Uint8Array[] = [];
    const drain = (async () => {
      for await (const chunk of out) chunks.push(chunk);
    })();
    await writer.put(rootBlock);
    await writer.close();
    await drain;

    const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
    const carBytes = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      carBytes.set(chunk, offset);
      offset += chunk.length;
    }

    await expect(extractDelegationBundle(carBytes)).rejects.toThrow(
      "missing required keys",
    );
  });

  it("round-trips public space bundle with undefined optional fields", async () => {
    const upload = new Uint8Array([1, 2, 3]);
    const name = new Uint8Array([4, 5, 6]);
    const plan = new Uint8Array([7, 8, 9]);

    // Simulates a public space — kms fields are undefined
    const carBytes = await createDelegationBundle({
      upload,
      name,
      plan,
      access: undefined,
      kmsProvider: undefined,
      kmsLocation: undefined,
      kmsKeyring: undefined,
    });

    const extracted = await extractDelegationBundle(carBytes);
    expect(new Uint8Array(extracted.upload)).toEqual(upload);
    expect(new Uint8Array(extracted.name)).toEqual(name);
    expect(new Uint8Array(extracted.plan)).toEqual(plan);
    expect(extracted.access).toBeUndefined();
    expect(extracted.kmsProvider).toBeUndefined();
    expect(extracted.kmsLocation).toBeUndefined();
    expect(extracted.kmsKeyring).toBeUndefined();
  });

  it("round-trips private space bundle with 1password kms fields", async () => {
    const upload = new Uint8Array([1, 2, 3]);
    const name = new Uint8Array([4, 5, 6]);
    const plan = new Uint8Array([7, 8, 9]);

    const carBytes = await createDelegationBundle({
      upload,
      name,
      plan,
      access: {
        type: "private",
        encryption: { provider: "1password", algorithm: "rsa-oaep-256" },
      },
      kmsProvider: "1password",
      kmsLocation: "my-team.1password.com",
      kmsKeyring: "Storacha Keys",
    });

    const extracted = await extractDelegationBundle(carBytes);
    expect(new Uint8Array(extracted.upload)).toEqual(upload);
    expect(new Uint8Array(extracted.name)).toEqual(name);
    expect(new Uint8Array(extracted.plan)).toEqual(plan);
    expect(extracted.access).toEqual({
      type: "private",
      encryption: { provider: "1password", algorithm: "rsa-oaep-256" },
    });
    expect(extracted.kmsProvider).toBe("1password");
    expect(extracted.kmsLocation).toBe("my-team.1password.com");
    expect(extracted.kmsKeyring).toBe("Storacha Keys");
  });

  it("round-trips private space bundle with google kms fields", async () => {
    const upload = new Uint8Array([11, 22, 33]);
    const name = new Uint8Array([44, 55, 66]);
    const plan = new Uint8Array([77, 88, 99]);

    const carBytes = await createDelegationBundle({
      upload,
      name,
      plan,
      access: {
        type: "private",
        encryption: { provider: "google", algorithm: "rsa-oaep-256" },
      },
      kmsProvider: "google",
    });

    const extracted = await extractDelegationBundle(carBytes);
    expect(new Uint8Array(extracted.upload)).toEqual(upload);
    expect(new Uint8Array(extracted.name)).toEqual(name);
    expect(new Uint8Array(extracted.plan)).toEqual(plan);
    expect(extracted.access).toEqual({
      type: "private",
      encryption: { provider: "google", algorithm: "rsa-oaep-256" },
    });
    expect(extracted.kmsProvider).toBe("google");
    // google KMS doesn't use location/keyring from 1password
    expect(extracted.kmsLocation).toBeUndefined();
    expect(extracted.kmsKeyring).toBeUndefined();
  });
});
