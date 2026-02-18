import * as fs from "node:fs/promises";
import * as path from "node:path";

/**
 * Read .clawrachaignore from workspace root (gitignore-style).
 * Returns parsed patterns, or empty array if file doesn't exist.
 */
export async function readIgnoreFile(workspace: string): Promise<string[]> {
  const ignorePath = path.join(workspace, ".clawrachaignore");
  try {
    const content = await fs.readFile(ignorePath, "utf-8");
    return content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
  } catch (err: any) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}
