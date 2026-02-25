import { createFileEncoderStream } from "@storacha/upload-client/unixfs";
import { CryptoConfig, Encoder } from "../types/index.js";
import { BlobLike } from "@storacha/client/types";
import { encryptToBlockStream } from "./crypto.js";
import type { Block } from "multiformats";

export const makeEncoder = (cryptoConfig: CryptoConfig | null): Encoder => {
  if (cryptoConfig) {
    return (input: BlobLike) => {
      return encryptToBlockStream(input, cryptoConfig.encryptionConfig);
    };
  }
  return (input: BlobLike) =>
    Promise.resolve(createFileEncoderStream(input) as ReadableStream<Block>);
};
