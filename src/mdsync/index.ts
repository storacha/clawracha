/**
 * mdsync — CRDT markdown storage on top of UCN Pail.
 *
 * Each key's value is a single DAG-CBOR block (DeserializedMarkdownEntry)
 * containing:
 *   - The current RGA tree (full document state)
 *   - An RGA of MarkdownEvents (causal history scoped to this key)
 *   - The last changeset applied (for incremental replay during merge)
 *
 * On read, if the Pail has multiple heads (concurrent writes), we resolve
 * by walking from the common ancestor forward, replaying each branch's
 * changesets and merging event RGAs.
 */

import { MemoryBlockstore, withCache } from "@storacha/ucn/block";
import {
  BlockFetcher,
  EventLink,
  Operation,
  ValueView,
} from "@storacha/ucn/pail/api";
import * as CRDT from "@web3-storage/pail/crdt";
import { Block, CID } from "multiformats";
import * as cbor from "@ipld/dag-cbor";
import {
  fromMarkdown,
  RGA,
  computeChangeSet,
  applyRGAChangeSet,
  RGATreeRoot,
  RGAChangeSet,
  toMarkdown,
  mergeRGATrees,
  serializeTree,
  deserializeTree,
  serializeRGA,
  deserializeRGA,
  serializeChangeSet,
  deserializeChangeSet as deserializeChangeSetStruct,
  stripUndefined,
} from "@storacha/md-merge";
import * as Pail from "@web3-storage/pail";
import { decode, encode } from "multiformats/block";
import { sha256 } from "multiformats/hashes/sha2";
import { EventFetcher } from "@web3-storage/pail/clock";

// ---- Event type ----

/**
 * A MarkdownEvent ties an RGA tree mutation to its position in the Pail's
 * merkle clock. `parents` are the EventLinks of the Pail revision that was
 * current when this edit was made — this is what links the md-merge causal
 * history to the Pail's causal history.
 *
 * Implements RGAEvent (toString) so it can be used as the event type in
 * md-merge's RGA and RGATree.
 */
class MarkdownEvent {
  parents: Array<EventLink>;

  constructor(parents: Array<EventLink>) {
    this.parents = parents;
  }

  toString() {
    return this.parents.map((p) => p.toString()).join(",");
  }
}

/** Deserialize a MarkdownEvent from its string representation (comma-separated CIDs). */
const parseMarkdownEvent = (str: string): MarkdownEvent => {
  if (!str) return new MarkdownEvent([]);
  const parentStrs = str.split(",");
  const parents = parentStrs.map((s) => CID.parse(s) as EventLink);
  return new MarkdownEvent(parents);
};

/** Serialize a MarkdownEvent for DAG-CBOR storage (via encodeRGA). */
const serializeMarkdownEvent = (event: MarkdownEvent): unknown => {
  return event.toString();
};

/** Deserialize a MarkdownEvent from a DAG-CBOR decoded value. */
const deserializeMarkdownEvent = (obj: unknown): MarkdownEvent => {
  if (typeof obj !== "string") {
    throw new Error(`Expected string, got ${typeof obj}`);
  }
  return parseMarkdownEvent(obj);
};

// ---- In-memory types ----

/** Shorthand for the event RGA type used throughout. */
type EventRGA = RGA<MarkdownEvent, MarkdownEvent>;

interface DeserializedMarkdownEntryBase {
  type: string;
  /** The full RGA tree for the document at this key. */
  root: RGATreeRoot<MarkdownEvent>;
  /**
   * Causal history as an RGA. Each node is a MarkdownEvent; the RGA's
   * afterId links encode causal ordering. toWeightedArray() gives a
   * BFS linearization suitable for building a comparator.
   */
  events: EventRGA;
}

interface DeserializedMarkdownEntryInitial extends DeserializedMarkdownEntryBase {
  type: "initial";
}

interface DeserializedMarkdownEntryUpdate extends DeserializedMarkdownEntryBase {
  type: "update";
  /** The changeset that was applied to produce this version of the tree. */
  changeset: RGAChangeSet<MarkdownEvent>;
}

type DeserializedMarkdownEntry =
  | DeserializedMarkdownEntryInitial
  | DeserializedMarkdownEntryUpdate;

// ---- Comparators ----

/**
 * Fallback comparator used when deserializing event RGAs. Since the event
 * RGA itself determines ordering (via toWeightedArray), this comparator
 * only needs to be deterministic — it lexicographically compares toString().
 */
const nohierarchyComparator = (a: MarkdownEvent, b: MarkdownEvent) =>
  a.toString() === b.toString() ? 0 : a.toString() < b.toString() ? -1 : 1;

/**
 * Build a comparator from the event RGA's weighted BFS ordering.
 * Events earlier in the BFS (closer to the root of the causal tree)
 * compare as "less than" later events.
 */
const makeComparator = (
  events: EventRGA,
): ((a: MarkdownEvent, b: MarkdownEvent) => number) => {
  const ordered = events.toWeightedArray();
  const index = new Map<string, number>(
    ordered.map((e, i) => [e.toString(), i]),
  );
  return (a, b) =>
    (index.get(a.toString()) ?? -1) - (index.get(b.toString()) ?? -1);
};

// ---- Single-block serialization ----

/**
 * Encode a DeserializedMarkdownEntry as a single DAG-CBOR block.
 * All data (tree, events, changeset) is inlined — no CID references.
 */
export const encodeMarkdownEntry = async (
  entry: DeserializedMarkdownEntry,
): Promise<Block> => {
  const flat: Record<string, unknown> = {
    type: entry.type,
    root: serializeTree(entry.root),
    events: serializeRGA(entry.events, serializeMarkdownEvent),
  };
  if (entry.type === "update") {
    flat.changeset = serializeChangeSet(entry.changeset);
  }
  return await encode({
    value: stripUndefined(flat),
    codec: cbor,
    hasher: sha256,
  });
};

/**
 * Decode a single DAG-CBOR block back to a DeserializedMarkdownEntry.
 */
export const decodeMarkdownEntry = async (block: {
  bytes: Uint8Array;
}): Promise<DeserializedMarkdownEntry> => {
  const decoded = await decode({
    bytes: block.bytes,
    codec: cbor,
    hasher: sha256,
  });
  const flat = decoded.value as {
    type: string;
    root: any;
    events: any;
    changeset?: any;
  };

  const eventRGA = deserializeRGA(
    flat.events,
    parseMarkdownEvent,
    deserializeMarkdownEvent,
    nohierarchyComparator,
  );
  const comparator = makeComparator(eventRGA);
  const root = deserializeTree(flat.root, parseMarkdownEvent, comparator);

  if (flat.type === "initial") {
    return { type: "initial", root, events: eventRGA };
  }

  const changeset = deserializeChangeSetStruct(
    flat.changeset,
    parseMarkdownEvent,
  );
  return { type: "update", root, events: eventRGA, changeset };
};

// ---- Core helpers ----

/**
 * Create the first entry for a key — bootstraps the RGA tree and
 * event RGA from raw markdown. Used when a key doesn't exist yet.
 */
const firstPut = (
  newMarkdown: string,
  parents: Array<EventLink>,
): DeserializedMarkdownEntry => {
  const markdownEvent = new MarkdownEvent(parents);
  const eventRGA = new RGA<MarkdownEvent, MarkdownEvent>(nohierarchyComparator);
  eventRGA.insert(undefined, markdownEvent, markdownEvent);
  // Only one event, so comparator is trivial (all nodes have the same event).
  const rgaRoot = fromMarkdown(newMarkdown, markdownEvent, (a, b) => 0);
  return {
    type: "initial",
    root: rgaRoot,
    events: eventRGA,
  };
};

// ---- Public API ----

/**
 * First put into an empty Pail (v0 = no existing revision).
 * Returns a single block to store. Caller is responsible for
 * creating the Pail revision via Revision.v0Put.
 */
export const v0Put = async (newMarkdown: string): Promise<Block> => {
  const entry = firstPut(newMarkdown, []);
  return encodeMarkdownEntry(entry);
};

/**
 * Put markdown content at a key in an existing Pail.
 *
 * If the key doesn't exist, creates an initial entry. If it does exist,
 * resolves the current value (merging concurrent heads if needed), computes
 * an RGA changeset against the resolved tree, applies it, and stores the
 * updated entry.
 *
 * Returns a single block to store, or null if no changes detected.
 * Caller is responsible for creating the Pail revision via Revision.put.
 */
export const put = async (
  blocks: BlockFetcher,
  current: ValueView,
  key: string,
  newMarkdown: string,
  decrypt?: (cid: CID) => Promise<Uint8Array>,
): Promise<Block | null> => {
  const mdEntry = await resolveValue(blocks, current, key, decrypt);
  if (!mdEntry) {
    // Key doesn't exist yet — bootstrap with firstPut.
    const entry = firstPut(
      newMarkdown,
      current.revision.map((r) => r.event.cid),
    );
    return encodeMarkdownEntry(entry);
  }
  const { events: eventRGA, root: rgaRoot } = mdEntry;

  // Create a new event anchored to the current Pail revision heads.
  const mdEvent = new MarkdownEvent(current.revision.map((r) => r.event.cid));

  // Insert after the last event in weighted order.
  const orderedNodes = eventRGA.toWeightedNodes();
  eventRGA.insert(orderedNodes[orderedNodes.length - 1].id, mdEvent, mdEvent);

  // Diff the current tree against the new markdown and apply.
  const changeset = computeChangeSet(rgaRoot, newMarkdown, mdEvent);
  if (changeset.changes.length === 0) {
    return null; // No changes to apply.
  }
  const comparator = makeComparator(eventRGA);
  const newRoot = applyRGAChangeSet(rgaRoot, changeset, comparator);

  return encodeMarkdownEntry({
    type: "update",
    root: newRoot,
    events: eventRGA,
    changeset,
  });
};

// ---- Resolution (multi-head merge) ----

/**
 * Resolve the current markdown value for a key, merging concurrent heads.
 *
 * If there's only one head (no concurrent writes), returns the entry directly.
 *
 * If there are multiple heads, finds their common ancestor in the Pail's
 * merkle clock, then replays all events from ancestor → heads in causal order.
 */
const resolveValue = async (
  blocks: BlockFetcher,
  current: ValueView,
  key: string,
  decrypt?: (cid: CID) => Promise<Uint8Array>,
): Promise<DeserializedMarkdownEntry | undefined> => {
  const mdEntryBlockCid = await Pail.get(blocks, current.root, key);
  if (!mdEntryBlockCid) {
    return undefined;
  }
  // Cache event blocks in memory so EventFetcher can find them.
  blocks = withCache(
    blocks,
    new MemoryBlockstore(current.revision.map((r) => r.event)),
  );
  const events = new EventFetcher<Operation>(blocks);

  // Fetch entry bytes: decrypt callback for private spaces, or raw block fetch.
  const getEntryBytes = async (cid: CID): Promise<Uint8Array> => {
    if (decrypt) return decrypt(cid);
    const block = await blocks.get(cid);
    if (!block) throw new Error(`Could not find block for CID ${cid}`);
    return block.bytes;
  };

  // Fast path: single head, no merge needed.
  if (current.revision.length === 1) {
    return decodeMarkdownEntry({
      bytes: await getEntryBytes(mdEntryBlockCid as CID),
    });
  }

  // Multi-head: find common ancestor and replay events in causal order.
  const ancestor = await CRDT.findCommonAncestor(
    events,
    current.revision.map((r) => r.event.cid),
  );
  if (!ancestor) {
    throw new Error(
      `Could not find common ancestor for revision ${current.revision.map((r) => r.event.cid)}`,
    );
  }

  // Start from the ancestor's state for this key (if it existed there).
  const aevent = await events.get(ancestor);
  let { root } = aevent.value.data;
  const rootMDEntryCid = await Pail.get(blocks, root, key);
  let mdEntry: DeserializedMarkdownEntry | undefined;
  if (rootMDEntryCid) {
    mdEntry = await decodeMarkdownEntry({
      bytes: await getEntryBytes(rootMDEntryCid as CID),
    });
  }

  // Get all events from ancestor → heads, sorted in deterministic causal order.
  const sorted = await CRDT.findSortedEvents(
    events,
    current.revision.map((r) => r.event.cid),
    ancestor,
  );

  // Filter to only events that touch this key.
  const relevantSorted = sorted.filter((e) => {
    const op = e.value.data;
    switch (op.type) {
      case "put":
        return op.key === key;
      case "del":
        return op.key === key;
      case "batch":
        return op.ops.some((o) => o.key === key);
      default:
        return false;
    }
  });

  // Replay each event, building up the merged tree and event history.
  for (const { value: event } of relevantSorted) {
    let data = event.data;
    // Reduce batch operations to the single op for this key.
    if (data.type === "batch") {
      const op = data.ops.find((o) => o.key === key);
      if (!op) {
        continue;
      }
      data = { ...data, ...op };
    }
    if (data.type === "put") {
      const mdEntryCid = await Pail.get(blocks, data.root, key);
      if (!mdEntryCid) {
        throw new Error(
          `Could not find markdown entry for CID ${data.root} and key ${key}`,
        );
      }
      const newMDEntry = await decodeMarkdownEntry({
        bytes: await getEntryBytes(mdEntryCid as CID),
      });

      if (newMDEntry.type === "initial") {
        if (mdEntry) {
          // Concurrent initial — merge event histories and RGA trees.
          mdEntry.events.merge(newMDEntry.events);
          const comparator = makeComparator(mdEntry.events);
          mdEntry = {
            type: "initial",
            events: mdEntry.events,
            root: mergeRGATrees(mdEntry.root, newMDEntry.root, comparator),
          };
        } else {
          mdEntry = newMDEntry;
        }
      } else {
        // Update — merge event histories, then apply the changeset.
        if (!mdEntry) {
          throw new Error(
            `Expected existing markdown entry for update event, found none for CID ${mdEntryCid}`,
          );
        }
        mdEntry.events.merge(newMDEntry.events);
        const comparator = makeComparator(mdEntry.events);
        mdEntry = {
          type: "update",
          events: mdEntry.events,
          root: applyRGAChangeSet(
            mdEntry.root,
            newMDEntry.changeset!,
            comparator,
          ),
          changeset: newMDEntry.changeset!,
        };
      }
    } else if (data.type === "del") {
      mdEntry = undefined;
    }
  }
  return mdEntry;
};

/**
 * Get the current markdown string for a key, resolving concurrent heads.
 * Returns undefined if the key doesn't exist.
 */
export const get = async (
  blocks: BlockFetcher,
  current: ValueView,
  key: string,
  decrypt?: (cid: CID) => Promise<Uint8Array>,
): Promise<string | undefined> => {
  const mdEntry = await resolveValue(blocks, current, key, decrypt);
  if (!mdEntry) {
    return undefined;
  }
  return toMarkdown(mdEntry.root);
};
