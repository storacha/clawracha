/**
 * Filesystem-backed blockstore — the one thing UCN doesn't ship.
 * Persists blocks to .storacha/blocks/ in workspace.
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import type { Link, Block, Version } from "multiformats";
import { decode } from "multiformats/block";
import * as raw from "multiformats/codecs/raw";
import { sha256 } from "multiformats/hashes/sha2";

export class DiskBlockstore {
  private dir: string;
  private initialized = false;

  constructor(workspacePath: string) {
    this.dir = path.join(workspacePath, ".storacha", "blocks");
  }

  private async ensureDir(): Promise<void> {
    if (!this.initialized) {
      await fs.mkdir(this.dir, { recursive: true });
      this.initialized = true;
    }
  }

  private cidPath(cid: Link<unknown, number, number, Version>): string {
    return path.join(this.dir, cid.toString());
  }

  async get<
    T = unknown,
    C extends number = number,
    A extends number = number,
    V extends Version = 1
  >(link: Link<T, C, A, V>): Promise<Block<T, C, A, V> | undefined> {
    try {
      const bytes = new Uint8Array(await fs.readFile(this.cidPath(link)));
      // Return a minimal block — decoder doesn't matter for storage, the CID is the truth
      return { cid: link, bytes, links: () => [] } as unknown as Block<
        T,
        C,
        A,
        V
      >;
    } catch (err: any) {
      if (err.code === "ENOENT") return undefined;
      throw err;
    }
  }

  async put(block: Block): Promise<void> {
    await this.ensureDir();
    await fs.writeFile(this.cidPath(block.cid), block.bytes);
  }
}
