import * as fs from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import * as stream from "node:stream";
import type { Block } from "multiformats";
import { CarWriter } from "@ipld/car/writer";
import type { BlobLike } from "@storacha/client/types";

export interface WritableCar {
  /**
   * Write a block to the CAR file.
   * Must not be called after close/switchToReadable.
   */
  put(block: Block): Promise<void>;
  cleanup(): Promise<void>;
  /**
   * Close the writer and return a readable for upload.
   * Returns null if nothing was written.
   */
  switchToReadable(): Promise<ReadableCar | null>;
}

interface ReadableCar {
  readable: BlobLike;
  cleanup(): Promise<void>;
}

export const makeTempCar = async (): Promise<WritableCar> => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "sync-clawracha-"));
  const cleanup = async () => await fs.rm(dir, { recursive: true });
  const file = path.join(dir, "blocks.car");

  // CarWriter.createAppender() creates a headerless/rootless CAR
  // which is fine for uploadCAR (the client handles it)
  const { writer, out } = CarWriter.createAppender();

  // Pipe the output to a file
  const fsWriteStream = createWriteStream(file);
  const pipePromise = stream.promises.pipeline(
    stream.Readable.from(out),
    fsWriteStream,
  );

  let didWrite = false;

  const put = async (block: Block) => {
    didWrite = true;
    await writer.put({ cid: block.cid as any, bytes: block.bytes });
  };

  const switchToReadable = async (): Promise<ReadableCar | null> => {
    try {
      await writer.close();
      await pipePromise;

      if (!didWrite) {
        await cleanup();
        return null;
      }

      return {
        readable: {
          stream: () =>
            stream.Readable.toWeb(createReadStream(file)) as unknown as ReadableStream<
              Uint8Array<ArrayBuffer>
            >,
        },
        cleanup,
      };
    } catch (err) {
      console.error("Error switching to readable:", err);
      await cleanup();
      throw err;
    }
  };

  return { put, switchToReadable, cleanup };
};
