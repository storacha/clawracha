import { BlockFetcher } from "@web3-storage/pail/api";
import { ContentFetcher, CryptoConfig } from "../types/index.js";
import { Signer } from "@ucanto/interface";
import { CID } from "multiformats/cid";
import { decrypt } from "@storacha/capabilities/space";
import { Client } from "@storacha/client";
import { decryptFile } from "@storacha/encrypt-upload-client/utils/decrypt";
import { getKMSCryptoAdapter } from "./crypto.js";
import { exporter, ReadableStorage } from "ipfs-unixfs-exporter";

export const makeContentFetcher = (
  cryptoConfig: CryptoConfig | null,
  blocks: BlockFetcher,
  client: Client,
  agent: Signer,
): ContentFetcher => {
  if (cryptoConfig) {
    const { decryptionConfig } = cryptoConfig;
    return async (cid: CID): Promise<Uint8Array> => {
      const decryptDelegation = await decrypt.delegate({
        issuer: agent,
        audience: agent,
        with: decryptionConfig.spaceDID,
        nb: {
          resource: cid,
        },
        expiration: Math.floor(Date.now() / 1000) + 60 * 15, // 15 minutes
        proofs: [decryptionConfig.decryptDelegation],
      });
      const { stream } = await decryptFile(
        getKMSCryptoAdapter(cryptoConfig.kmsEndpoint),
        client,
        readableStorageFromFetcher(blocks),
        cid,
        {
          ...decryptionConfig,
          decryptDelegation,
        },
      );
      return drainStream(stream);
    };
  }
  return async (cid: CID): Promise<Uint8Array> => {
    const entry = await exporter(cid, readableStorageFromFetcher(blocks));
    if (entry.type !== "file" && entry.type !== "raw") {
      throw new Error(
        `Expected file or raw entry for CID ${cid}, got ${entry.type}`,
      );
    }
    return drainStream(entry.content());
  };
};

const readableStorageFromFetcher = (blocks: BlockFetcher): ReadableStorage => ({
  get: async (cid: CID) => {
    const block = await blocks.get(cid);
    if (!block) throw new Error(`Block not found for CID ${cid}`);
    return block.bytes as Uint8Array;
  },
});

/**
 * Drain an AsyncIterable (or ReadableStream) into a single Uint8Array.
 */
async function drainStream(
  iter: AsyncIterable<Uint8Array>,
): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of iter) {
    chunks.push(chunk);
  }
  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}
