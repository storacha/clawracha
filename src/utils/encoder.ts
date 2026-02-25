import { createFileEncoderStream } from "@storacha/upload-client/unixfs";
import { CryptoConfig, Encoder } from "../types";
import { BlobLike } from "@storacha/client/types";
import { encryptToBlockStream } from "./crypto";
import { Block } from "multiformats/block/interface";

export const makeEncoder = (cryptoConfig: CryptoConfig | null): Encoder => {
  if (cryptoConfig) {
    return (input: BlobLike) => {
      return encryptToBlockStream(input, cryptoConfig.encryptionConfig);
    };
  }
  return (input: BlobLike) =>
    Promise.resolve(createFileEncoderStream(input) as ReadableStream<Block>);
};
