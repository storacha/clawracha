import { describe, it, expect } from "vitest";
import { bytesToBlobLike } from "../../src/utils/crypto.js";

describe("crypto helpers", () => {
  it("bytesToBlobLike wraps bytes into a streamable blob", async () => {
    const input = new Uint8Array([1, 2, 3, 4, 5]);
    const blob = bytesToBlobLike(input);

    expect(blob.stream).toBeTypeOf("function");

    const stream = blob.stream();
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    expect(chunks.length).toBe(1);
    expect(chunks[0]).toEqual(input);
  });

  it("bytesToBlobLike handles empty bytes", async () => {
    const input = new Uint8Array(0);
    const blob = bytesToBlobLike(input);
    const stream = blob.stream();
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    expect(chunks.length).toBe(1);
    expect(chunks[0].length).toBe(0);
  });
});
