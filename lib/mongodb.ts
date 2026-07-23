import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Cache the connection across invocations (not just in dev). Serverless
// platforms like Vercel reuse warm execution contexts between requests, so
// creating a new MongoClient per-request opens far more TLS connections
// than Atlas expects and can cause the connections to be dropped.
if (!global._mongoClientPromise) {
  global._mongoClientPromise = new MongoClient(uri).connect();
}
const clientPromise: Promise<MongoClient> = global._mongoClientPromise;

export default clientPromise;

export const DB_NAME = process.env.MONGODB_DB || "vogue_jewellers";
export const ENTRIES_COLLECTION = "giveaway_entries";

let indexesEnsured = false;

export async function ensureEntryIndexes() {
  if (indexesEnsured) return;
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(ENTRIES_COLLECTION);
  await Promise.all([
    collection.createIndex({ email: 1 }, { unique: true }),
    collection.createIndex({ phone: 1 }, { unique: true }),
  ]);
  indexesEnsured = true;
}

export type Entry = {
  _id: unknown;
  name: string;
  email: string;
  phone: string;
  role?: string;
  createdAt?: string | Date;
};

// Old entries stored createdAt as a Date; new ones as a pre-formatted
// Sri Lanka time string (dd/mm/yyyy hh:mm am/pm).
export function formatCreatedAt(value: string | Date | null | undefined): string {
  if (value == null) return "-";
  const formatted =
    value instanceof Date
      ? value
          .toLocaleString("en-GB", {
            timeZone: "Asia/Colombo",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .replace(",", "")
      : value;
  // Some ICU versions emit U+202F/U+00A0 before am/pm; PDF fonts can't encode them.
  return formatted.replace(/[\u202f\u00a0]/g, " ");
}

export type EntryFilters = {
  q?: string;
  from?: string;
  to?: string;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildEntryQuery(filters: EntryFilters) {
  const query: Record<string, unknown> = {};
  const and: Record<string, unknown>[] = [];

  if (filters.q?.trim()) {
    const pattern = new RegExp(escapeRegex(filters.q.trim()), "i");
    and.push({
      $or: [{ name: pattern }, { email: pattern }, { phone: pattern }],
    });
  }

  const createdAt: Record<string, Date> = {};
  if (filters.from) {
    const from = new Date(filters.from);
    if (!Number.isNaN(from.getTime())) createdAt.$gte = from;
  }
  if (filters.to) {
    const to = new Date(filters.to);
    if (!Number.isNaN(to.getTime())) {
      to.setHours(23, 59, 59, 999);
      createdAt.$lte = to;
    }
  }
  if (Object.keys(createdAt).length > 0) and.push({ createdAt });

  if (and.length > 0) query.$and = and;
  return query;
}

const CREATED_AT_STRING_RE = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s*(am|pm)$/i;

// createdAt is a Date on old entries and a pre-formatted "dd/mm/yyyy hh:mm am/pm"
// string on newer ones (see formatCreatedAt). Mongo's sort compares by BSON type
// before value, so the two shapes don't interleave correctly by real time —
// parse both into a timestamp and sort here instead.
function entryTimestamp(value: string | Date | null | undefined): number {
  if (value == null) return -Infinity;
  if (value instanceof Date) return value.getTime();
  const match = CREATED_AT_STRING_RE.exec(value.replace(/[  ]/g, " "));
  if (!match) return -Infinity;
  const [, day, month, year, hourStr, minute, meridiem] = match;
  let hour = Number(hourStr) % 12;
  if (meridiem.toLowerCase() === "pm") hour += 12;
  return new Date(Number(year), Number(month) - 1, Number(day), hour, Number(minute)).getTime();
}

export async function getEntries(filters: EntryFilters) {
  const client = await clientPromise;
  const collection = client
    .db(DB_NAME)
    .collection<Entry>(ENTRIES_COLLECTION);
  const entries = await collection.find(buildEntryQuery(filters)).toArray();
  return entries.sort((a, b) => entryTimestamp(b.createdAt) - entryTimestamp(a.createdAt));
}
