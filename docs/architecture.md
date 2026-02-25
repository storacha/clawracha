# Architecture Guide

Technical deep-dive into how Clawracha works.

## Overview

Clawracha is an OpenClaw plugin that syncs agent workspaces to Storacha Spaces. It runs as a background service on the OpenClaw gateway, watching one workspace per configured agent. The sync layer is built on UCN Pail — a multiwriter CRDT key-value store backed by merkle clocks — so multiple devices can write concurrently without coordination.

```
┌─────────────────────────────────────────────────┐
│                  OpenClaw Gateway                │
│                                                  │
│  ┌──────────────┐    ┌──────────────────────┐   │
│  │  FileWatcher  │───▶│     SyncEngine       │   │
│  │  (chokidar)   │    │                      │   │
│  └──────────────┘    │  processChanges()     │   │
│                      │  sync()               │   │
│                      │  pullRemote()         │   │
│                      └──────────┬───────────┘   │
│                                 │                │
│            ┌────────────────────┼──────────┐     │
│            ▼                    ▼          ▼     │
│    ┌──────────────┐  ┌──────────┐  ┌──────────┐ │
│    │  UCN Pail    │  │ Storacha │  │ Tiered   │ │
│    │  (CRDT KV)   │  │ Client   │  │Blockstore│ │
│    └──────────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────┘
```

## Module Map

```
src/
├── plugin.ts          # OpenClaw plugin entry — registers service, CLI, tools, HTTP handler
├── commands.ts        # Core command logic (init, setup, join, grant) shared by CLI + onboard
├── sync.ts            # SyncEngine — orchestrates watch→encode→diff→publish→upload→apply
├── watcher.ts         # FileWatcher — chokidar wrapper with debouncing
├── prompts.ts         # Interactive prompts (readline/promises, zero deps)
├── types/
│   └── index.ts       # TypeScript interfaces (DeviceConfig, SyncState, SpaceAccess, etc.)
├── handlers/
│   ├── process.ts     # processChanges() — encode files, diff against pail, produce PailOps
│   ├── apply.ts       # applyPendingOps() — batch ops into UCN revision, publish
│   └── remote.ts      # applyRemoteChanges() — write remote changes to local filesystem
├── blockstore/
│   ├── index.ts       # Re-exports UCN block utilities + custom stores
│   ├── disk.ts        # DiskBlockstore — filesystem-backed (.storacha/blocks/)
│   └── workspace.ts   # createWorkspaceBlockstore() — tiered: LRU → Disk → Gateway
├── mdsync/
│   └── index.ts       # Markdown CRDT sync — RGA tree merge via @storacha/md-merge
└── utils/
    ├── bundle.ts      # Delegation bundle pack/unpack (single CAR with upload+name+plan+access)
    ├── client.ts      # createStorachaClient() — builds Client from DeviceConfig
    ├── contentfetcher.ts # makeContentFetcher() — CID→bytes (UnixFS export or KMS decrypt)
    ├── crypto.ts      # Encryption helpers (KMS adapter, encryptToBlockStream)
    ├── delegation.ts  # Delegation CID encoding/decoding (CIDv1 + identity multihash + base64)
    ├── differ.ts      # diffEntries() and diffRemoteChanges() — pail state diffing
    ├── encoder.ts     # makeEncoder() — Blob→blocks (UnixFS or encrypted, depending on config)
    ├── ignore.ts      # readIgnoreFile() — .clawrachaignore parser
    ├── tempcar.ts     # WritableCar — temp file CAR writer for streaming uploads
    └── workspace.ts   # resolveAgentWorkspace() — mirrors OpenClaw's workspace resolution
```

## Sync Lifecycle

### Startup

1. Plugin registers a background service (`storacha-sync`)
2. On start, iterates all agents in `config.agents.list`
3. For each agent with a completed setup (`.storacha/config.json` has `setupComplete: true`):
   - Creates a `SyncEngine` via `SyncEngine.fromConfig(workspace, deviceConfig)` — this builds all dependencies (Storacha client, UCN name, encoder, content fetcher) and injects them
   - Calls `engine.start()` to resolve the current revision
   - Creates a `FileWatcher` pointed at the workspace
   - Stores the pair in `activeSyncers` map

### The Sync Loop

When files change:

```
FileWatcher.onChange(changes)
  → engine.processChanges(changes)    # Encode + diff → PailOps
  → engine.sync()                      # Publish + upload + pull remote
  → saveDeviceConfig(nameArchive)      # Persist name state
```

#### processChanges (handlers/process.ts)

Takes an `Encoder` (Blob→blocks) and `ContentFetcher` (CID→bytes), both injected by SyncEngine. This makes processChanges agnostic to whether the space is public or private.

Splits changes into markdown vs regular files:

**Regular files:**
- Read file bytes from disk
- Fetch existing content via `contentFetcher(existingCID)` and compare bytes — skip if unchanged (this is critical for encrypted spaces where re-encryption produces different CIDs for the same content)
- Encode via `encoder(blob)` → drain blocks → root CID
- Emit `put` op

**Markdown files (.md):**
- `mdsync.put()` — resolves existing value via `contentFetcher`, merges concurrent heads, computes RGA changeset, applies it
- `mdsync.v0Put()` — first write, bootstraps RGA tree
- Result block bytes are encoded through `encoder()` like regular files — this means even small CRDT entries are UnixFS-wrapped (or encrypted), providing a uniform CID format in the pail

**Deletes:** Check if key exists in pail, emit `del` op if so.

#### sync (sync.ts)

1. Snapshot current pail entries (`beforeEntries`)
2. If pending ops exist:
   - `applyPendingOps()` — batch puts + individual dels into a UCN revision (does **not** publish)
   - **Upload CAR to Storacha** — blocks must be available remotely before other peers see the update
   - `publish()` — publish the revision to UCN (clock update). Publish additions (clock/name blocks) go into a fresh CAR for the next round.
   - If `remainingOps` (from bootstrap v0Put), repeat with fresh CAR
3. If no pending ops: just `Revision.resolve()` to pull remote
4. Snapshot pail entries again (`afterEntries`)
5. Diff before/after → `diffRemoteChanges()` → `applyRemoteChanges()`
6. Update `lastSync` timestamp

**Upload-before-publish** is critical: if we published first, other peers would see the clock update and try to fetch blocks that haven't been uploaded yet.

The sync is serialized through `syncLock` (promise chain) to prevent concurrent syncs.

#### applyPendingOps (handlers/apply.ts)

A pure function that produces a `RevisionResult` (revision + block additions) without publishing. The caller is responsible for uploading blocks and then publishing separately.

- Uses `Batch.create()` for multiple ops (UCN's batch API supports puts + dels)
- Bootstrap case: when no current value exists, uses `Revision.v0Put()` for the first put, then returns remaining ops for the next round (caller must upload between rounds so blocks are available remotely)
- Returns `{ revision, additions, remainingOps }` — no side effects on the clock

#### applyRemoteChanges (handlers/remote.ts)

Takes a `ContentFetcher` (CID→bytes), injected by SyncEngine.

For each changed path:

- **Deleted remotely** → `fs.unlink()`
- **Markdown** → `mdsync.get()` (CRDT resolve via `contentFetcher` + serialize to string) → `fs.writeFile()`
- **Regular file** → `contentFetcher(cid)` → `fs.writeFile()` (handles both public UnixFS reassembly and private decryption transparently)

## Blockstore Architecture

Three-tier read chain with cache promotion:

```
Read: LRU Memory (1024 blocks) → DiskBlockstore → GatewayBlockFetcher
Write: Memory + Disk (dual-write)
```

- **LRU Memory** — fast access for hot blocks, capped at 1024
- **DiskBlockstore** — persists blocks to `.storacha/blocks/{cid}` files
- **GatewayBlockFetcher** — fetches from IPFS gateway for blocks not available locally (e.g., from other devices)
- **withCache** — promotes fetched blocks into the LRU cache automatically

## Markdown CRDT (mdsync)

Markdown files get special treatment — instead of whole-file replacement, they use a CRDT merge strategy so concurrent edits from different devices converge without conflicts.

### Data Model

Each markdown entry is a single DAG-CBOR block containing:

```typescript
{
  type: "initial" | "update",
  root: RGATreeRoot,      // Full RGA tree (document state)
  events: RGA<Event>,     // Causal history as an RGA
  changeset?: RGAChangeSet // The changeset that produced this version (updates only)
}
```

The **RGA tree** (from `@storacha/md-merge`) mirrors the mdast structure but replaces every `children` array with an RGA (Replicated Growable Array). This means insertions, deletions, and reorderings carry causal IDs and can be merged deterministically.

The **event RGA** tracks causal ordering by linking markdown events to Pail revision heads (merkle clock events). Its BFS linearization provides the comparator for RGA merge.

### Multi-Head Resolution

When multiple devices write concurrently, the Pail ends up with multiple revision heads. Resolution:

1. Find common ancestor via `CRDT.findCommonAncestor()`
2. Get sorted events from ancestor → all heads via `CRDT.findSortedEvents()`
3. Filter to events touching this key
4. Start from ancestor's state, replay each event's changeset in order
5. Merge event RGAs at each step to maintain unified causal history

For single-head (no concurrent writes), it's a fast path — just decode and return.

### Why Single-Block Entries?

Each entry is self-contained in one block. This makes encryption simple — encrypt the whole block, and CRDT merge still works because the Pail clock (which tracks "who wrote what when") is separate from the entry content. On decrypt, you get the full entry and can replay changesets normally.

## Delegation Model

Clawracha uses three UCAN delegations, all stored in `DeviceConfig`:

| Delegation | Purpose | Capabilities |
|-----------|---------|-------------|
| `uploadDelegation` | Upload files to the Space | `space/*` (all space access capabilities) |
| `nameDelegation` | Read/write the UCN Pail clock | Name-specific (via `name.grant()`) |
| `planDelegation` | KMS access for encryption/decryption | `plan/get` on the account DID |

### Delegation Flow

**Setup (first device):**
1. Login to Storacha → get account
2. Create Space with chosen access type
3. Delegate space access: Space → Agent (`uploadDelegation`)
4. Delegate plan access: Account → Agent (`planDelegation`)
5. Create UCN Name (generates `nameArchive`)

**Grant (to another device):**
1. Re-delegate upload: Agent → Target DID
2. Re-delegate name: `name.grant(targetDID)`
3. Re-delegate plan: Agent → Target DID (chained from existing)
4. Pack all three + `access` config into a delegation bundle (single CAR)

**Join (on new device):**
1. Parse delegation bundle
2. Extract and store all three delegations
3. Set `access` from bundle (so device knows if space is encrypted)
4. Pull remote state
5. Start watching

### Bundle Format

The delegation bundle is a single CAR file with one root block (DAG-CBOR):

```typescript
{
  upload: Uint8Array,  // Upload delegation archive
  name: Uint8Array,    // Name delegation archive  
  plan: Uint8Array,    // Plan delegation archive
  access?: SpaceAccess // Space access config (public/private)
}
```

When passed as a CLI argument, bundles are encoded as CIDv1 with:
- Codec: CAR (0x0202)
- Multihash: identity (raw bytes inline)
- Base encoding: base64

This matches the Storacha CLI's delegation format.

## Encryption (Private Spaces)

For private spaces, all content is encrypted before upload. The encryption/decryption logic is abstracted behind two interfaces — `Encoder` and `ContentFetcher` — so the sync engine and handlers are agnostic to access type.

### Encoder and ContentFetcher

Both are created at `SyncEngine.fromConfig()` time based on the space's access config:

- **`makeEncoder(cryptoConfig)`** (`utils/encoder.ts`):
  - Public: wraps `createFileEncoderStream` (UnixFS encoding)
  - Private: wraps `encryptToBlockStream` (KMS-based encryption)
  - Signature: `(blob: Blob) => Promise<ReadableStream<Block>>`

- **`makeContentFetcher(cryptoConfig, blocks, client, agent)`** (`utils/contentfetcher.ts`):
  - Public: uses `ipfs-unixfs-exporter` to reassemble content from local blockstore (which falls back to gateway for missing blocks)
  - Private: delegates `space/content/decrypt` per-CID (15-minute expiry), calls `decryptFile` via KMS adapter
  - Signature: `(cid: CID) => Promise<Uint8Array>`

### Encrypt Path

1. `makeEncryptionConfig()` — builds config with agent as issuer, space DID, proofs (plan + upload delegations)
2. `encryptToBlockStream()` — uses `@storacha/encrypt-upload-client`:
   - `encryptFile()` via KMS adapter → encrypted payload
   - `encryptedBlockStream()` → stream of encrypted blocks
3. Blocks are drained into the CAR file, root CID stored in pail

### Decrypt Path

1. `makeContentFetcher()` returns a `(cid: CID) => Promise<Uint8Array>` closure
2. On each call (private spaces):
   - Delegates `space/content/decrypt` scoped to the specific CID, 15-minute expiry
   - Calls `decryptFile()` from `@storacha/encrypt-upload-client/utils/decrypt` with KMS adapter, client, and local blockstore
   - Drains the decrypted stream to bytes
3. Used by both `applyRemoteChanges` (regular files) and `mdsync` (markdown entries) via the same interface

### KMS Details

- **Service:** `https://ucan-kms-production.protocol-labs.workers.dev`
- **DID:** `did:key:z6MksQJobJmBfPhjHWgFXVppqM6Fcjc1k7xu4z6xvusVrtKv`
- Plan delegation is re-delegated to the KMS service DID so it can verify account access

## CAR Streaming

Blocks aren't accumulated in memory. Instead:

1. `makeTempCar()` creates a temp file and a `CarWriter`
2. Blocks are streamed to disk as they're produced (`writer.put()`)
3. `switchToReadable()` closes the writer, returns a `BlobLike` stream from the file
4. `storachaClient.uploadCAR()` streams the file to Storacha
5. Temp file is cleaned up after upload

`CarWriter.create()` (not `createAppender`) is used — `uploadCAR` handles rootless CARs.

## HTTP Endpoint

The plugin registers an HTTP handler at:

```
POST /api/channels/clawracha/workspace-update
```

Body: `{ "agentId": "...", "workspace": "..." }`

This restarts the syncer for a workspace without restarting the gateway. Used by `setup` and `join` commands after completing one-shot sync — they call `requestWorkspaceUpdate()` which hits this endpoint on the local gateway.

The `/api/channels/` prefix piggybacks on the gateway's existing auth, so no extra auth middleware is needed.

## Device Config

Stored at `<workspace>/.storacha/config.json`:

```typescript
interface DeviceConfig {
  agentKey: string;           // Ed25519 private key (base64)
  nameArchive?: string;       // UCN name state (base64 CID)
  uploadDelegation?: string;  // Space access delegation (base64 CID)
  nameDelegation?: string;    // Name delegation (base64 CID)
  planDelegation?: string;    // Plan/KMS delegation (base64 CID)
  spaceDID?: string;          // Space DID (did:key:...)
  access?: SpaceAccess;       // { type: "public" } | { type: "private", encryption: {...} }
  setupComplete?: boolean;    // Gate for watcher startup
}
```

The `nameArchive` is updated after every sync — it captures the full UCN name state so the device can resume without re-resolving from scratch.

## Local Storage

```
<workspace>/
├── .storacha/
│   ├── config.json         # DeviceConfig
│   └── blocks/             # DiskBlockstore (CID-named files)
├── .clawrachaignore        # Custom ignore patterns (optional)
└── ... (workspace files)
```
