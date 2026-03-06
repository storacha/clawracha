# @storacha/clawracha

Sync [OpenClaw](https://github.com/openclaw/openclaw) agent workspaces to [Storacha](https://storacha.network) — decentralized, encrypted, multi-device.

No servers. No accounts to share. Just UCAN delegations and content-addressed data.

## What It Does

Clawracha watches your agent's workspace for file changes and syncs them to a Storacha Space via [UCN Pail](https://github.com/storacha/ucn) — a CRDT key-value store backed by merkle clocks. Multiple devices can sync the same workspace without conflicts.

- **Regular files** → content-addressed via UnixFS, stored as CIDs
- **Markdown files** → CRDT merge via [md-merge](https://github.com/storacha/md-merge) — concurrent edits merge automatically, no conflicts
- **Private spaces** → end-to-end encrypted via KMS before upload
- **Multi-device** → delegation bundles let you grant access to other devices

## Quick Start

### 1. Install

```bash
# In your OpenClaw project
pnpm add @storacha/clawracha
```

Add to your OpenClaw config (`openclaw.config.json` or equivalent):

```json
{
  "plugins": {
    "clawracha": {
      "enabled": true
    }
  }
}
```

### 2. Initialize

Generate an agent identity for your workspace:

```bash
openclaw clawracha init --agent myagent
```

This creates a `.storacha/config.json` in the agent's workspace with a fresh Ed25519 keypair.

### 3. Set Up a New Workspace

```bash
openclaw clawracha setup --agent myagent
```

This will:
1. Ask for your Storacha email (sends a confirmation link)
2. Wait for email confirmation and payment plan verification
3. Ask you to choose **Public** or **Private (encrypted)** access
4. If encrypted, choose **Storacha Cloud** or **1Password** key management
5. Create a new Storacha Space
6. Generate delegations (upload, name, plan)
7. Do an initial sync of existing workspace files
8. Start watching for changes

### 4. Add Another Device

On the **existing device** (the one already set up):

```bash
openclaw clawracha grant did:key:z6Mk... --agent myagent
```

This outputs a delegation bundle (a base64 string). Copy it.

On the **new device**:

```bash
openclaw clawracha init --agent myagent
openclaw clawracha join <paste-bundle-here> --agent myagent
```

The new device pulls all existing files and starts syncing.

### Interactive Setup

Don't want to remember the steps? Use the guided flow:

```bash
openclaw clawracha onboard --agent myagent
```

This walks you through init → setup/join interactively.

## CLI Commands

All commands require `--agent <id>` to specify which agent workspace to operate on.

| Command | Description |
|---------|-------------|
| `init --agent <id>` | Generate agent identity (Ed25519 keypair) |
| `setup --agent <id>` | Create a new Storacha Space via login |
| `join <bundle> --agent <id>` | Join an existing workspace from a delegation bundle |
| `grant <DID> --agent <id>` | Create a delegation bundle for another device |
| `status --agent <id>` | Show sync status (delegations, space, running state) |
| `inspect --agent <id>` | Debug internal state (pail entries, pending ops, revisions) |
| `onboard --agent <id>` | Interactive guided setup |

### Grant Options

```bash
# Output bundle as base64 to stdout (default)
openclaw clawracha grant did:key:z6Mk... --agent myagent

# Write bundle to a file instead
openclaw clawracha grant did:key:z6Mk... --agent myagent -o bundle.car
```

## Agent Tools

When the plugin is running, agents get two MCP tools:

- **`storacha_sync_status`** — Check current sync state (running, last sync, entry count, pending changes)
- **`storacha_sync_now`** — Trigger an immediate sync cycle

## How Sync Works

1. **File watcher** (chokidar) detects changes in the workspace
2. Changed files are encoded:
   - Regular files → UnixFS DAG blocks
   - Markdown files → CRDT entry via md-merge (RGA tree + event history)
   - Private spaces → encrypted before encoding
3. Changes become pail operations (put/del)
4. Operations are batched into a UCN revision and published
5. All blocks are packed into a CAR file and uploaded to Storacha
6. Remote changes from other devices are pulled, diffed, and applied locally

See [docs/architecture.md](docs/architecture.md) for the full technical deep-dive and [docs/reference.md](docs/reference.md) for hidden features, edge cases, and troubleshooting.

## Configuration

In your OpenClaw plugin config:

```json
{
  "plugins": {
    "clawracha": {
      "enabled": true,
      "watchPatterns": ["**/*"],
      "ignorePatterns": [".git", "node_modules", ".storacha"]
    }
  }
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `enabled` | `false` | Enable/disable the sync plugin |
| `watchPatterns` | `["**/*"]` | Glob patterns for files to sync |
| `ignorePatterns` | `[".git", "node_modules", ".storacha"]` | Glob patterns to exclude |

## Public vs Private Spaces

During setup, you choose the access type:

- **Public** — Files are stored as plaintext on IPFS/Filecoin. Anyone with the CID can access them.
- **Private (encrypted)** — Files are encrypted before upload. Only devices with the proper delegations can decrypt.

When you choose encrypted, you pick a **key management provider**:

### Storacha Cloud (Google KMS)

Uses Storacha's hosted KMS service (`kms.storacha.network`). Keys are managed server-side in Google Cloud KMS. **Requires a paid Storacha plan.** The space is marked as `private` in Storacha, and the plan delegation grants KMS access.

### 1Password (Local)

Uses a local KMS server backed by the 1Password desktop app. Keys are stored as items in your 1Password vault — never leaving your machine. **No paid plan required.** The space is `public` from Storacha's perspective (Storacha doesn't know about the encryption), but clawracha encrypts everything locally before upload.

During setup you provide:
- **1Password account name** — which 1Password account to use
- **Vault name** — where to store keys (default: "Storacha Space Keys")

The vault is created automatically if it doesn't exist. Multiple spaces can share a vault.

#### Security Model

The 1Password SDK runs in a **separate process** — a bundled ucan-kms server that clawracha forks on startup. Private key material never enters the plugin's address space. See the [Architecture Guide](docs/architecture.md#process-isolation-security-model) for details on why this matters.

## Requirements

- Node.js ≥ 20
- OpenClaw ≥ 2026.0.0
- A [Storacha account](https://console.storacha.network) (paid plan required for Storacha Cloud encryption)
- [1Password desktop app](https://1password.com/downloads) (only if using 1Password encryption)

## Docs

- **[Architecture Guide](docs/architecture.md)** — How it works under the hood (sync lifecycle, CRDT merge, blockstore tiers, encryption, delegation model)
- **[Reference](docs/reference.md)** — `.clawrachaignore`, `inspect` command, delegation encoding, troubleshooting

## License

Apache-2.0 OR MIT
