# Reference Guide

Hidden features, edge cases, and configuration details.

## .clawrachaignore

Create a `.clawrachaignore` file in your workspace root to exclude files from sync. Uses gitignore-style patterns:

```
# Don't sync build artifacts
dist/
*.tmp

# Skip large binary files
*.zip
*.tar.gz

# Ignore secrets
.env
.env.local
```

- One pattern per line
- Lines starting with `#` are comments
- Empty lines are ignored
- Patterns are relative to the workspace root
- `.storacha/**` is always ignored (you can't override this)

The default ignore patterns (from plugin config) are:
- `.storacha/**`
- `node_modules/**`
- `.git/**`
- `dist/**`

`.clawrachaignore` patterns are **additive** — they add to the defaults, not replace them.

## Delegation Encoding

Delegations are encoded as CIDv1 strings with:
- **Codec:** CAR (`0x0202`)
- **Multihash:** identity (raw bytes inlined in the CID)
- **Base:** base64

This is the same format used by the Storacha CLI (`storacha delegation create --base64`), so delegations are interoperable.

```bash
# These are equivalent inputs to `join`:
openclaw clawracha join ./bundle.car --agent myagent      # file path
openclaw clawracha join mAXASI...longbase64... --agent myagent  # base64 CID string
```

## Space Access Types

### Public (unencrypted)
- Files stored as plaintext on IPFS/Filecoin
- Anyone with the CID can fetch the content
- No KMS interaction needed
- Faster (no encrypt/decrypt overhead)

### Encrypted — Storacha Cloud (Google KMS)
- All content encrypted before upload via `@storacha/encrypt-upload-client`
- Keys managed server-side by Storacha's hosted KMS (`kms.storacha.network`)
- Storacha sees the space as `private` — server-side key setup via `space/encryption/setup`
- Requires `planDelegation` for KMS access
- Decrypt delegations are scoped per-CID with 15-minute expiry
- **Requires a paid Storacha plan**

### Encrypted — 1Password (Local)
- All content encrypted before upload, same client library
- Keys stored in 1Password vaults as SshKey items
- Storacha sees the space as `public` — encryption is entirely client-side
- Local KMS server (`vendor/local-server.mjs`) forked as a child process
- 1Password account name + vault name provided during setup
- Vault created automatically if it doesn't exist
- **No paid plan required** — works with free Storacha accounts
- See [Architecture Guide](architecture.md#process-isolation-security-model) for the security model

You choose the access type and KMS provider during `setup`. When using `grant`/`join`, the full config (access type, KMS provider, location, keyring) is included in the delegation bundle automatically — the joining device inherits the same encryption setup.

## Markdown CRDT Merge

Markdown files (`.md`) are special — they use CRDT merge instead of last-writer-wins:

- Two devices can edit the same `.md` file concurrently
- Changes are merged at the AST level (headings, paragraphs, lists, etc.)
- The merge is deterministic — all devices converge to the same result
- No manual conflict resolution needed

**Limitations:**
- Merge operates on mdast (markdown AST) nodes, not individual characters
- If two devices edit the same paragraph differently, both versions are preserved (not interleaved)
- Very large markdown files with deep nesting may produce larger entry blocks

## Name Archive Persistence

After every sync, the UCN name archive is saved back to `config.json`. This captures the full name state (delegation chain + revision pointers) so the device can resume exactly where it left off.

If you delete `config.json` but keep the blocks directory, you'll need to re-join — there's no way to reconstruct the name state from blocks alone.

## syncLock

All sync operations are serialized through a promise chain (`syncLock`). This prevents concurrent syncs from corrupting state. If a sync fails, the chain is healed so subsequent syncs can proceed.

`pullRemote()` also goes through the lock — it's just a sync without local changes.

## Inspect Command

`openclaw clawracha inspect --agent <id>` shows internal state useful for debugging:

```
🔥 Storacha Inspect [myagent]
Workspace: /home/user/.openclaw/workspace-myagent
Running: true
Root CID: bafy...
Revisions: 3
  event: bafy...
  event: bafy...
  event: bafy...

Pail entries (5):
  README.md
  notes/daily.md
  config.yaml
  data/users.json
  memory/2026-02-20.md

Pending ops (0):
```

- **Root CID** — current pail root (null if empty)
- **Revisions** — merkle clock events for the current value
- **Pail entries** — all synced file paths and their CIDs
- **Pending ops** — operations waiting to be published (should be 0 when idle)

## HTTP Workspace Update

You can trigger a workspace sync restart without restarting the gateway:

```bash
curl -X POST http://127.0.0.1:18789/api/channels/clawracha/workspace-update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"agentId": "myagent", "workspace": "/path/to/workspace"}'
```

The CLI commands (`setup`, `join`) call this automatically after completing their one-shot sync.

## Blockstore Details

The tiered blockstore uses CID-named files in `.storacha/blocks/`:

```
.storacha/blocks/
├── bafyrei...   # Each file is raw block bytes, filename is the CID
├── bafyrei...
└── ...
```

The LRU cache holds up to 1024 blocks in memory (configurable). The gateway fetcher defaults to `https://storacha.link` for missing blocks.

## Plugin Config Schema

Full schema for `openclaw.plugin.json`:

```json
{
  "enabled": true,
  "watchPatterns": ["**/*"],
  "ignorePatterns": [".git", "node_modules", ".storacha"]
}
```

- `watchPatterns` — glob patterns relative to workspace. Default watches everything.
- `ignorePatterns` — glob patterns to exclude. Combined with `.clawrachaignore`.
- Patterns are joined with the workspace path before being passed to chokidar.

## File Watcher Behavior

- Uses chokidar with `awaitWriteFinish` (200ms stability threshold, 100ms poll)
- Changes are debounced at 500ms — rapid edits are batched
- Deduplication: if the same file changes multiple times during debounce, only the last event type is kept
- `initialAdd` flag controls whether existing files trigger `add` events on startup:
  - `true` during `setup` (initial upload of existing files)
  - `false` during normal operation and `join` (only new changes)

## Troubleshooting

### "Workspace not set up"
Run `openclaw clawracha init --agent <id>` followed by `setup` or `join`.

### "No upload delegation in device config"
The setup didn't complete. Check `.storacha/config.json` for `setupComplete: true`.

### "Failed to extract plan delegation"
The plan delegation may have expired or the account plan may have lapsed. Re-run `setup` with a fresh login.

### Sync not starting after gateway restart
Check that `setupComplete` is `true` in the device config. The service skips workspaces without completed setup.

### "Private space requires a plan delegation for KMS access"
Private spaces need all three delegations. If you're joining, make sure the granting device has a valid plan delegation.

### Large identity CIDs causing errors
Delegation bundles can be large (they inline the full CAR). Some operations may fail with name-too-long errors if the CID is passed in contexts expecting short strings. Use file paths for large bundles: `openclaw clawracha grant ... -o bundle.car` then `openclaw clawracha join ./bundle.car ...`.
