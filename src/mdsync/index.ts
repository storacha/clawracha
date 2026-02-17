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

class MarkdownEvent {
  parents: Array<EventLink>;

  constructor(parents: Array<EventLink>) {
    this.parents = parents;
  }

  toString() {
    return JSON.stringify(this.parents);
  }
}

const parseMarkdownEvent = (str: string): MarkdownEvent => {
  const obj = JSON.parse(str);
  return new MarkdownEvent(obj.parents);
};

const serializeMarkdownEvent = (event: MarkdownEvent): unknown => {
  return event.toString();
};

const deserializeMarkdownEvent = (obj: unknown): MarkdownEvent => {
  if (typeof obj !== "string") {
    throw new Error(`Expected string, got ${typeof obj}`);
  }
  return parseMarkdownEvent(obj);
};

interface MarkdownEntryBase {
  type: string;
  root: CID;
  events: CID;
}

interface MarkdownEntryInitial extends MarkdownEntryBase {
  type: "initial";
}

interface MarkdownEntryUpdate extends MarkdownEntryBase {
  type: "update";
  changeset: CID;
}

interface RevisionResult {
  revision: RevisionView;
  additions: Block[];
  removals: Block[];
}

type MarkdownEntry = MarkdownEntryInitial | MarkdownEntryUpdate;

type EventRGA = RGA<MarkdownEvent, MarkdownEvent>;

interface DeserializedMarkdownEntryBase {
  type: string;
  root: RGATreeRoot<MarkdownEvent>;
  events: EventRGA;
}

interface DeserializedMarkdownEntryInitial extends DeserializedMarkdownEntryBase {
  type: "initial";
}

interface DeserializedMarkdownEntryUpdate extends DeserializedMarkdownEntryBase {
  type: "update";
  changeset: RGAChangeSet<MarkdownEvent>;
}

type DeserializedMarkdownEntry =
  | DeserializedMarkdownEntryInitial
  | DeserializedMarkdownEntryUpdate;

const nohierarchyComparator = (a: MarkdownEvent, b: MarkdownEvent) =>
  a.toString() === b.toString() ? 0 : a.toString() < b.toString() ? -1 : 1;

const makeComparator = (
  events: EventRGA,
): ((a: MarkdownEvent, b: MarkdownEvent) => number) => {
  const ordered = events.toWeightedArray();
  return (a, b) => ordered.indexOf(a) - ordered.indexOf(b);
};

interface MarkdownResult {
  mdEntryCid: CID;
  additions: Block[];
}

const firstPut = async (
  newMarkdown: string,
  parents: Array<EventLink>,
): Promise<MarkdownResult> => {
  const markdownEvent = new MarkdownEvent(parents);
  const eventRGA = new RGA<MarkdownEvent, MarkdownEvent>(nohierarchyComparator);
  eventRGA.insert(undefined, markdownEvent, markdownEvent);
  const eventBlock = await encodeRGA(eventRGA, serializeMarkdownEvent);
  // only one event here
  const rgaRoot = fromMarkdown(newMarkdown, markdownEvent, (a, b) => 0);
  return serializeMarkdownEntry({
    type: "initial",
    root: rgaRoot,
    events: eventRGA,
  });
};

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
 * Put a value (a CID) for the given key. If the key exists it's value is
 * overwritten.
 *
 * @param {API.BlockFetcher} blocks Bucket block storage.
 * @param {API.ValueView} current
 * @param {string} key The key of the value to put.
 * @param {API.UnknownLink} value The value to put.
 * @returns {Promise<API.RevisionResult>}
 */
export const put = async (
  blocks: BlockFetcher,
  current: ValueView,
  key: string,
  newMarkdown: string,
): Promise<RevisionResult> => {
  const resolvedValue = await resolveValue(blocks, current, key);
  if (!resolvedValue) {
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
  // deserialize the existing markdown entry to get the current root and events
  const {
    additions: resolvedAdditions,
    mdEntry: { events: eventRGA, root: rgaRoot },
  } = resolvedValue;
  const mdEvent = new MarkdownEvent(current.revision.map((r) => r.event.cid));
  const orderedNodes = eventRGA.toWeightedNodes();
  eventRGA.insert(orderedNodes[orderedNodes.length - 1].id, mdEvent, mdEvent);
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
      ...resolvedAdditions,
      ...additions,
      ...revisionResult.additions,
    ],
    removals: [...revisionResult.removals],
  };
};

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

const getRSATreeFromRootCID = async (
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

const deserializedMarkdownEntryCID = async (
  blocks: BlockFetcher,
  mdEntryCid: CID,
): Promise<DeserializedMarkdownEntry> => {
  const mdEntry = await getMarkdownEntry(blocks, mdEntryCid);
  const eventRGA = await getEventRGAFromCID(blocks, mdEntry.events);
  const rgaRoot = await getRSATreeFromRootCID(blocks, mdEntry.root, eventRGA);
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

type ResolvedMarkdownValue = {
  mdEntry: DeserializedMarkdownEntry;
  additions: Block[];
};
const resolveValue = async (
  blocks: BlockFetcher,
  current: ValueView,
  key: string,
): Promise<ResolvedMarkdownValue | undefined> => {
  const mdEntryBlockCid = await Pail.get(blocks, current.root, key);
  if (!mdEntryBlockCid) {
    return undefined;
  }
  blocks = withCache(
    blocks,
    new MemoryBlockstore(current.revision.map((r) => r.event)),
  );
  const events = new EventFetcher<Operation>(blocks);
  if (current.revision.length === 1) {
    const mdEntry = await deserializedMarkdownEntryCID(
      blocks,
      mdEntryBlockCid as CID,
    );
    return {
      mdEntry,
      additions: [],
    };
  }
  const ancestor = await CRDT.findCommonAncestor(
    events,
    current.revision.map((r) => r.event.cid),
  );
  if (!ancestor) {
    throw new Error(
      `Could not find common ancestor for revision ${current.revision.map((r) => r.event.cid)}`,
    );
  }
  const aevent = await events.get(ancestor);
  let { root } = aevent.value.data;
  const rootMDEntryCid = await Pail.get(blocks, root, key);
  let mdEntry = rootMDEntryCid
    ? await deserializedMarkdownEntryCID(blocks, rootMDEntryCid as CID)
    : undefined;
  const sorted = await CRDT.findSortedEvents(
    events,
    current.revision.map((r) => r.event.cid),
    ancestor,
  );
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

  for (const { value: event } of relevantSorted) {
    let data = event.data;
    // reduce batch operations to the relevant operation for the key
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
      const newMDEntry = await getMarkdownEntry(blocks, mdEntryCid as CID);
      if (newMDEntry.type === "initial") {
        if (mdEntry) {
          throw new Error(
            `Expected no existing markdown entry for initial event, found ${mdEntryCid}`,
          );
        }
        const eventRGA = await getEventRGAFromCID(blocks, newMDEntry.events);
        mdEntry = {
          type: "initial",
          events: eventRGA,
          root: await getRSATreeFromRootCID(blocks, newMDEntry.root, eventRGA),
        };
      } else {
        if (!mdEntry) {
          throw new Error(
            `Expected existing markdown entry for update event, found none for CID ${mdEntryCid}`,
          );
        }
        const eventRGA = mdEntry.events;
        eventRGA.merge(await getEventRGAFromCID(blocks, newMDEntry.events));
        const changeset = await getRGAChangeSetFromCID(
          blocks,
          newMDEntry.changeset,
        );
        const comparator = makeComparator(eventRGA);
        mdEntry = {
          type: "update",
          events: eventRGA,
          root: applyRGAChangeSet(mdEntry.root, changeset, comparator),
          changeset,
        };
      }
    } else if (data.type === "del") {
      mdEntry = undefined;
    }
  }
  if (!mdEntry) {
    return undefined;
  }
  const { additions } = await serializeMarkdownEntry(mdEntry);
  return {
    mdEntry,
    additions,
  };
};

export const get = async (
  blocks: BlockFetcher,
  current: ValueView,
  key: string,
): Promise<string | undefined> => {
  const resolvedValue = await resolveValue(blocks, current, key);
  if (!resolvedValue) {
    return undefined;
  }
  return toMarkdown(resolvedValue.mdEntry.root);
};
