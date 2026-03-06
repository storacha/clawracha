/**
 * Manages the local ucan-kms server process (1Password backend).
 * Forks the bundled local-server.mjs and discovers its DID via GET /.
 */

import { fork, type ChildProcess } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const LOCAL_SERVER_SCRIPT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../vendor/local-server.mjs",
);
const LOCAL_KMS_URL = "http://127.0.0.1:8787";
const STARTUP_TIMEOUT_MS = 10_000;
const POLL_INTERVAL_MS = 200;

let serverProcess: ChildProcess | null = null;
let serverDid: string | null = null;

/**
 * Start the local KMS server if not already running.
 * Returns the discovered DID.
 */
export async function startLocalKms(): Promise<string> {
  if (serverProcess && serverDid) return serverDid;

  serverProcess = fork(LOCAL_SERVER_SCRIPT, [], {
    stdio: "pipe",
    env: {
      ...process.env,
      PORT: "8787",
    },
  });

  if (serverProcess.stdout) {
    serverProcess.stdout.on("data", (data) => {
      console.log(`[local-kms] ${data.toString().trim()}`);
    });
  }
  if (serverProcess.stderr) {
    serverProcess.stderr.on("data", (data) => {
      console.error(`[local-kms] ${data.toString().trim()}`);
    });
  }
  serverProcess.on("exit", (code) => {
    console.error(`[local-kms] Process exited with code ${code}`);
    serverProcess = null;
    serverDid = null;
  });

  // Wait for the server to be ready by polling GET /
  const deadline = Date.now() + STARTUP_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${LOCAL_KMS_URL}/`);
      if (res.ok) {
        const text = await res.text();
        const did = text
          .trim()
          .split("\n")
          .map((l) => l.trim())
          .find((l) => l.startsWith("did:key:"));
        if (did) {
          serverDid = did;
          return did;
        }
      }
    } catch {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }

  // Timed out — kill and throw
  stopLocalKms();
  throw new Error(
    `Local KMS server failed to start within ${STARTUP_TIMEOUT_MS}ms`,
  );
}

/**
 * Stop the local KMS server if running.
 */
export function stopLocalKms(): void {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
    serverDid = null;
  }
}
