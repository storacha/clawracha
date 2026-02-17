/**
 * mdsync — CRDT markdown storage on top of UCN Pail.
 *
 * Stores RGA-backed markdown trees at Pail keys. Each key's value is a
 * MarkdownEntry containing:
 *   - The current RGA tree (full document state)
 *   - An RGA of MarkdownEvents (causal history scoped to this key)
 *   - The last changeset applied (for incremental replay during merge)
 *
 * On read, if the Pail has multiple heads (concurrent writes), we resolve
 * by walking from the common ancestor forward, replaying each branch's
 * changesets and merging event RGAs — analogous to how Pail itself resolves
 * concurrent root updates.
 */

import { MemoryBlockstore, withCache } from "@storacha/ucn/block";
import {
  BlockFetcher,
  EventLink,
  Operation,
  RevisionView,
  ValueView,
} from "@storacha/ucn/pail/api";
import * as CRDT from "@web3-storage/pail/crdt";
import { Block, CID } from "multiformats";
import * as cbor from "@ipld/dag-cbor";
import * as Revision from "@storacha/ucn/pail/revision";
import {
  fromMarkdown,
  encodeTree,
  encodeRGA,
  RGA,
  decodeRGA,
  decodeTree,
  computeChangeSet,
  applyRGAChangeSet,
  encodeChangeSet,
  RGATreeRoot,
  RGAChangeSet,
  decodeChangeSet,
  toMarkdown,
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

// ---- On-disk types (CID references, stored in DAG-CBOR) ----

interface MarkdownEntryBase {
  type: string;
  /** CID of the DAG-CBOR encoded RGATree — the full current document state. */
  root: CID;
  /** CID of the DAG-CBOR encoded event RGA — causal history for this key. */
  events: CID;
}

interface MarkdownEntryInitial extends MarkdownEntryBase {
  type: "initial";
}

interface MarkdownEntryUpdate extends MarkdownEntryBase {
  type: "update";
  /** CID of the DAG-CBOR encoded RGAChangeSet applied in this event. */
  changeset: CID;
}

interface RevisionResult {
  revision: RevisionView;
  additions: Block[];
  removals: Block[];
}

/** Serialized form stored at each Pail key — CID pointers to the actual data blocks. */
type MarkdownEntry = MarkdownEntryInitial | MarkdownEntryUpdate;

/** Shorthand for the event RGA type used throughout. */
type EventRGA = RGA<MarkdownEvent, MarkdownEvent>;

// ---- In-memory types (deserialized, ready to operate on) ----

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
 * compare as "less than" later events. This is used as the EventComparator
 * for all RGA tree operations — it determines how concurrent inserts are
 * ordered in the document.
 */
const makeComparator = (
  events: EventRGA,
): ((a: MarkdownEvent, b: MarkdownEvent) => number) => {
  const ordered = events.toWeightedArray();
  const index = new Map<string, number>(ordered.map((e, i) => [e.toString(), i]));
  return (a, b) =>
    (index.get(a.toString()) ?? -1) - (index.get(b.toString()) ?? -1);
};

// ---- Serialization helpers ----

interface MarkdownResult {
  mdEntryCid: CID;
  additions: Block[];
}

/**
 * Create the first MarkdownEntry for a key — bootstraps the RGA tree and
 * event RGA from raw markdown. Used when a key doesn't exist yet.
 */
const firstPut = async (
  newMarkdown: string,
  parents: Array<EventLink>,
): Promise<MarkdownResult> => {
  const markdownEvent = new MarkdownEvent(parents);
  const eventRGA = new RGA<MarkdownEvent, MarkdownEvent>(nohierarchyComparator);
  eventRGA.insert(undefined, markdownEvent, markdownEvent);
  const eventBlock = await encodeRGA(eventRGA, serializeMarkdownEvent);
  // Only one event, so comparator is trivial (all nodes have the same event).
  const rgaRoot = fromMarkdown(newMarkdown, markdownEvent, (a, b) => 0);
  return serializeMarkdownEntry({
    type: "initial",
    root: rgaRoot,
    events: eventRGA,
  });
};

// ---- Public API ----

/**
 * First put into an empty Pail (v0 = no existing revision).
 * Creates the initial revision with a single markdown entry.
 */
export const v0Put = async (
  blocks: BlockFetcher,
  key: string,
  newMarkdown: string,
): Promise<RevisionResult> => {
  const { mdEntryCid, additions } = await firstPut(newMarkdown, []);
  const revisionResult = await Revision.v0Put(blocks, key, mdEntryCid);
  return {
    revision: revisionResult.revision,
    additions: [...additions, ...revisionResult.additions],
    removals: [...revisionResult.removals],
  };
};

/**
 * Put markdown content at a key in an existing Pail.
 *
 * If the key doesn't exist, creates an initial entry. If it does exist,
 * resolves the current value (merging concurrent heads if needed), computes
 * an RGA changeset against the resolved tree, applies it, and stores the
 * updated entry.
 */
export const put = async (
  blocks: BlockFetcher,
  current: ValueView,
  key: string,
  newMarkdown: string,
): Promise<RevisionResult> => {
  const mdEntry = await resolveValue(blocks, current, key);
  if (!mdEntry) {
    // Key doesn't exist yet — bootstrap with firstPut.
    const { mdEntryCid, additions } = await firstPut(
      newMarkdown,
      current.revision.map((r) => r.event.cid),
    );
    const revisionResult = await Revision.put(blocks, current, key, mdEntryCid);
    return {
      revision: revisionResult.revision,
      additions: [...additions, ...revisionResult.additions],
      removals: [...revisionResult.removals],
    };
  }
  const { events: eventRGA, root: rgaRoot } = mdEntry;

  // Create a new event anchored to the current Pail revision heads.
  const mdEvent = new MarkdownEvent(current.revision.map((r) => r.event.cid));

  // Insert after the last event in weighted order — this places the new event
  // deeper than all existing events in the causal tree, correctly representing
  // that it incorporates all known history.
  const orderedNodes = eventRGA.toWeightedNodes();
  eventRGA.insert(orderedNodes[orderedNodes.length - 1].id, mdEvent, mdEvent);

  // Diff the current tree against the new markdown and apply.
  const changeset = computeChangeSet(rgaRoot, newMarkdown, mdEvent);
  const comparator = makeComparator(eventRGA);
  const newRoot = applyRGAChangeSet(rgaRoot, changeset, comparator);

  const newMDEntry: DeserializedMarkdownEntry = {
    type: "update",
    root: newRoot,
    events: eventRGA,
    changeset,
  };
  const { mdEntryCid, additions } = await serializeMarkdownEntry(newMDEntry);
  const revisionResult = await Revision.put(blocks, current, key, mdEntryCid);
  return {
    revision: revisionResult.revision,
    additions: [
      ...additions,
      ...revisionResult.additions,
    ],
    removals: [...revisionResult.removals],
  };
};

// ---- Block fetching helpers ----

/** Decode a MarkdownEntry (CID pointers) from a DAG-CBOR block. */
const getMarkdownEntry = async (
  blocks: BlockFetcher,
  mdEntryCid: CID,
): Promise<MarkdownEntry> => {
  const mdEntryBlock = await blocks.get(mdEntryCid);
  if (!mdEntryBlock) {
    throw new Error(
      `Could not find markdown entry block for CID ${mdEntryCid}`,
    );
  }
  return (
    await decode({ bytes: mdEntryBlock.bytes, codec: cbor, hasher: sha256 })
  ).value as MarkdownEntry;
};

/** Fetch and decode the event RGA from its block CID. */
const getEventRGAFromCID = async (
  blocks: BlockFetcher,
  eventsCid: CID,
): Promise<EventRGA> => {
  const eventBlock = await blocks.get(eventsCid);
  if (!eventBlock) {
    throw new Error(`Could not find event block for CID ${eventsCid}`);
  }
  const eventRGA = await decodeRGA(
    eventBlock,
    parseMarkdownEvent,
    deserializeMarkdownEvent,
    nohierarchyComparator,
  );
  return eventRGA;
};

/** Fetch and decode an RGAChangeSet from its block CID. */
const getRGAChangeSetFromCID = async (
  blocks: BlockFetcher,
  changesetCid: CID,
): Promise<RGAChangeSet<MarkdownEvent>> => {
  const changesetBlock = await blocks.get(changesetCid);
  if (!changesetBlock) {
    throw new Error(`Could not find changeset block for CID ${changesetCid}`);
  }
  return await decodeChangeSet(changesetBlock, parseMarkdownEvent);
};

/** Fetch and decode an RGA tree from its block CID, using the event RGA for ordering. */
const getRGATreeFromRootCID = async (
  blocks: BlockFetcher,
  rootCid: CID,
  eventRGA: EventRGA,
): Promise<RGATreeRoot<MarkdownEvent>> => {
  const comparator = makeComparator(eventRGA);
  const rootBlock = await blocks.get(rootCid);
  if (!rootBlock) {
    throw new Error(`Could not find root block for CID ${rootCid}`);
  }
  return await decodeTree(rootBlock, parseMarkdownEvent, comparator);
};

/**
 * Fully deserialize a MarkdownEntry from its CID — fetches and decodes
 * the entry, event RGA, tree, and (if update) changeset.
 */
const deserializedMarkdownEntryCID = async (
  blocks: BlockFetcher,
  mdEntryCid: CID,
): Promise<DeserializedMarkdownEntry> => {
  const mdEntry = await getMarkdownEntry(blocks, mdEntryCid);
  const eventRGA = await getEventRGAFromCID(blocks, mdEntry.events);
  const rgaRoot = await getRGATreeFromRootCID(blocks, mdEntry.root, eventRGA);
  if (mdEntry.type === "initial") {
    return {
      type: "initial",
      root: rgaRoot,
      events: eventRGA,
    };
  }

  const changeset = await getRGAChangeSetFromCID(blocks, mdEntry.changeset);
  return {
    type: "update",
    root: rgaRoot,
    events: eventRGA,
    changeset,
  };
};

/**
 * Serialize a DeserializedMarkdownEntry to DAG-CBOR blocks.
 * Returns the entry's CID and all blocks that need to be stored
 * (event RGA, tree, changeset if update, and the entry itself).
 */
const serializeMarkdownEntry = async (
  entry: DeserializedMarkdownEntry,
): Promise<MarkdownResult> => {
  let blocks: Block[] = [];
  const eventBlock = await encodeRGA(entry.events, serializeMarkdownEvent);
  blocks.push(eventBlock);
  const rootBlock = await encodeTree(entry.root);
  blocks.push(rootBlock);
  const changesetBlock =
    entry.type === "update"
      ? await encodeChangeSet(entry.changeset)
      : undefined;
  if (changesetBlock) {
    blocks.push(changesetBlock);
  }
  const mdEntry =
    entry.type === "initial"
      ? {
          type: "initial",
          root: rootBlock.cid,
          events: eventBlock.cid,
        }
      : {
          type: "update",
          root: rootBlock.cid,
          events: eventBlock.cid,
          changeset: changesetBlock?.cid,
        };
  const mdEntryBlock = await encode({
    value: mdEntry,
    codec: cbor,
    hasher: sha256,
  });
  blocks.push(mdEntryBlock);
  return {
    mdEntryCid: mdEntryBlock.cid,
    additions: blocks,
  };
};

// ---- Resolution (multi-head merge) ----

/**
 * Resolve the current markdown value for a key, merging concurrent heads.
 *
 * If there's only one head (no concurrent writes), returns the entry directly.
 *
 * If there are multiple heads, finds their common ancestor in the Pail's
 * merkle clock, then replays all events from ancestor → heads in causal order.
 * For each "put" event:
 *   - If "initial": bootstraps the entry (must be the first event for this key)
 *   - If "update": merges the event's causal history into the running event RGA,
 *     then applies the changeset to the running tree using the merged comparator
 * For "del" events: clears the entry (file deleted).
 *
 * This is analogous to how Pail resolves concurrent root updates — walk from
 * common ancestor, replay operations in deterministic order.
 */
const resolveValue = async (
  blocks: BlockFetcher,
  current: ValueView,
  key: string,
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

  // Fast path: single head, no merge needed.
  if (current.revision.length === 1) {
    return await deserializedMarkdownEntryCID(
      blocks,
      mdEntryBlockCid as CID,
    );
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
  let mdEntry = rootMDEntryCid
    ? await deserializedMarkdownEntryCID(blocks, rootMDEntryCid as CID)
    : undefined;

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
      // Fetch the MarkdownEntry that was stored with this event.
      const mdEntryCid = await Pail.get(blocks, data.root, key);
      if (!mdEntryCid) {
        throw new Error(
          `Could not find markdown entry for CID ${data.root} and key ${key}`,
        );
      }
      const newMDEntry = await getMarkdownEntry(blocks, mdEntryCid as CID);
      if (newMDEntry.type === "initial") {
        // First write for this key — bootstrap from the stored entry.
        if (mdEntry) {
          throw new Error(
            `Expected no existing markdown entry for initial event, found ${mdEntryCid}`,
          );
        }
        const eventRGA = await getEventRGAFromCID(blocks, newMDEntry.events);
        mdEntry = {
          type: "initial",
          events: eventRGA,
          root: await getRGATreeFromRootCID(blocks, newMDEntry.root, eventRGA),
        };
      } else {
        // Update — merge event histories, then apply the changeset.
        if (!mdEntry) {
          throw new Error(
            `Expected existing markdown entry for update event, found none for CID ${mdEntryCid}`,
          );
        }
        // Merge the event's causal history into our running history.
        // RGA merge is commutative — order of merging doesn't matter.
        const eventRGA = mdEntry.events;
        eventRGA.merge(await getEventRGAFromCID(blocks, newMDEntry.events));
        const changeset = await getRGAChangeSetFromCID(
          blocks,
          newMDEntry.changeset,
        );
        // Rebuild comparator from merged event history, then apply changeset.
        const comparator = makeComparator(eventRGA);
        mdEntry = {
          type: "update",
          events: eventRGA,
          root: applyRGAChangeSet(mdEntry.root, changeset, comparator),
          changeset,
        };
      }
    } else if (data.type === "del") {
      // Key deleted — clear state. If re-created later, it'll be a new "initial".
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
): Promise<string | undefined> => {
  const mdEntry = await resolveValue(blocks, current, key);
  if (!mdEntry) {
    return undefined;
  }
  return toMarkdown(mdEntry.root);
};
