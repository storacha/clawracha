/**
 * File watcher - monitors workspace for changes
 *
 * Uses chokidar to watch for file changes and batches them
 * before triggering sync.
 */

import chokidar from "chokidar";
import { readIgnoreFile } from "./utils/ignore.js";
import * as path from "node:path";
import type { FileChange, SyncPluginConfig } from "./types/index.js";

export interface WatcherOptions {
  workspace: string;
  config: SyncPluginConfig;
  onChanges: (changes: FileChange[]) => Promise<void>;
  debounceMs?: number;
  initialAdd?: boolean; // Whether to emit "add" events for existing files on startup
}

export class FileWatcher {
  private watcher: chokidar.FSWatcher | null = null;
  private pendingChanges: Map<string, FileChange> = new Map();
  private debounceTimer: NodeJS.Timeout | null = null;
  private readyPromise: Promise<void> | null = null;
  private options: WatcherOptions;
  private debounceMs: number;

  constructor(options: WatcherOptions) {
    this.options = options;
    this.debounceMs = options.debounceMs ?? 500;
  }

  /**
   * Start watching the workspace
   */
  async start(): Promise<void> {
    if (this.watcher) return;

    const { workspace, config } = this.options;

    // Read workspace-level ignore file
    const userIgnored = await readIgnoreFile(workspace);

    // Build watch patterns
    const watchPaths = config.watchPatterns.map((p) => path.join(workspace, p));

    // Build ignore patterns
    const ignored = [
      ...config.ignorePatterns,
      ...userIgnored,
      ".storacha/**", // Always ignore our own data
    ].map((p) => path.join(workspace, p));

    this.watcher = chokidar.watch(watchPaths, {
      ignored,
      persistent: true,
      ignoreInitial: !this.options.initialAdd,
      awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 100,
      },
    });

    this.readyPromise = new Promise<void>((resolve) => {
      this.watcher!.on("ready", () => resolve());
    });

    this.watcher
      .on("add", (filePath) => this.handleChange("add", filePath))
      .on("change", (filePath) => this.handleChange("change", filePath))
      .on("unlink", (filePath) => this.handleChange("unlink", filePath))
      .on("error", (err) => console.error("Watcher error:", err));
  }

  /**
   * Wait for chokidar to finish its initial scan
   */
  async waitForReady(): Promise<void> {
    if (!this.readyPromise) {
      throw new Error("Watcher not started");
    }
    return this.readyPromise;
  }

  /**
   * Stop watching
   */
  async stop(): Promise<void> {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    if (this.watcher) {
      await this.watcher.close();
      this.watcher = null;
    }
  }

  /**
   * Handle a file change event
   */
  private handleChange(
    type: "add" | "change" | "unlink",
    filePath: string,
  ): void {
    const relativePath = path.relative(this.options.workspace, filePath);

    // Dedupe: later events for same path replace earlier ones
    this.pendingChanges.set(relativePath, { type, path: relativePath });

    // Debounce: wait for activity to settle before processing
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.flush();
    }, this.debounceMs);
  }

  /**
   * Flush pending changes to callback
   */
  private async flush(): Promise<void> {
    if (this.pendingChanges.size === 0) return;

    const changes = Array.from(this.pendingChanges.values());
    this.pendingChanges.clear();

    try {
      await this.options.onChanges(changes);
    } catch (err) {
      console.error("Error processing file changes:", err);
    }
  }

  /**
   * Force immediate flush (for testing)
   */
  async forceFlush(): Promise<void> {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    await this.flush();
  }
}
