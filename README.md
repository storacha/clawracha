# @storacha/clawracha

OpenClaw plugin for Storacha workspace sync via UCN Pail.

## Overview

Clawracha syncs OpenClaw agent workspaces to Storacha using UCN (User Controlled Names) with Pail — a CRDT-based KV store backed by merkle clocks.

**Features:**

- 🔄 Live sync of workspace files (`.md` by default)
- 🌐 Multi-device, multi-user via UCAN delegation
- 🔀 CRDT-based conflict resolution (merkle clock)
- 📦 Local-first with network sync

## Installation

```bash
openclaw plugins install @storacha/clawracha
```

## Setup

Setup is done via slash commands in your chat session with the agent (not CLI commands).

### Step 1: Initialize the agent

```
/storacha-init
```

Generates an agent identity and displays the Agent DID. You'll need this DID to create delegations.

### Step 2: Choose your path

**New workspace (first device):**

```
/storacha-setup <upload-delegation-b64>
```

Have the space owner create an upload delegation for your Agent DID, then import it. Creates a fresh UCN Name and starts syncing.

**Join an existing workspace (additional devices):**

```
/storacha-join <upload-delegation-b64> <name-delegation-b64>
```

Get both delegations by running `/storacha-grant` on the existing device. The join command pulls all remote files before the watcher starts, so your local workspace is fully synced from the start.

### Grant access to another device

```
/storacha-grant <target-agent-DID>
```

Generates upload and name delegations for the target device. The target device uses these with `/storacha-join`.

### Check status

```
/storacha-status
```

After setup, restart the gateway to start syncing:

```bash
openclaw gateway restart
```

## How It Works

```
Workspace Files                 UCN Pail KV Store
================                ================
/AGENTS.md          ────►       "AGENTS.md" → bafk...xyz
/SOUL.md            ────►       "SOUL.md" → bafk...abc
/memory/2026-02-10.md ────►     "memory/2026-02-10.md" → bafk...123
```

The sync loop:

1. **Watch** - File watcher detects changes
2. **Encode** - Files → UnixFS DAG → root CID
3. **Diff** - Compare local vs pail entries
4. **Batch** - Generate UCN revision with all changes
5. **Upload** - All blocks → CAR → Storacha
6. **Apply** - Remote changes → local filesystem

## Configuration

In your OpenClaw config:

```yaml
plugins:
  entries:
    storacha-sync:
      enabled: true
      config:
        watchPatterns:
          - "**/*.md"
        ignorePatterns:
          - ".git"
          - "node_modules"
          - ".storacha"
```

## Agent Tools

The plugin provides tools for manual sync control:

- `storacha_sync_status` - Get current sync status
- `storacha_sync_now` - Trigger immediate sync

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  OpenClaw Agent Workspace                               │
│  ┌─────────────────┐     ┌─────────────────┐            │
│  │  Workspace      │◄───►│  File Watcher   │            │
│  │  *.md files     │     │  (chokidar)     │            │
│  └─────────────────┘     └────────┬────────┘            │
│           │                       │                     │
│           ▼                       ▼                     │
│  ┌─────────────────┐     ┌─────────────────┐            │
│  │  .storacha/     │     │  Sync Engine    │            │
│  │  ├─ config.json │◄───►│  (UCN Pail)     │            │
│  │  └─ blocks/     │     └────────┬────────┘            │
│  └─────────────────┘              │                     │
└───────────────────────────────────┼─────────────────────┘
                                    │
                                    ▼ publish/resolve
┌───────────────────────────────────────────────────────┐
│  Storacha Network                                     │
│  ┌───────────────────┐  ┌───────────────────────────┐ │
│  │  UCN Rendezvous   │  │  Storage Nodes            │ │
│  │  (clock/head)     │  │  (blob storage)           │ │
│  └───────────────────┘  └───────────────────────────┘ │
└───────────────────────────────────────────────────────┘
```

## Local Data

The plugin stores data in `.storacha/` within the workspace:

- `config.json` - Agent key, delegations, name archive (NOT synced)
- `blocks/` - Local block cache (NOT synced)

Add `.storacha/` to your `.gitignore`.

## Status

🚧 **Work in Progress**

- [x] Plugin scaffold
- [x] Tiered blockstore (memory → disk → gateway)
- [x] File encoder (UnixFS)
- [x] Differ (local ↔ pail)
- [x] Sync engine (UCN Pail batch)
- [x] File watcher
- [x] OpenClaw plugin integration
- [ ] CAR upload to Storacha
- [ ] Remote file download/apply
- [ ] Encryption (encrypt-upload-client)
- [ ] Full test coverage

## License

Apache-2.0 OR MIT
