import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.DB_URI;
if (!uri) throw new Error("Missing DB_URI in .env.local");

const g = globalThis;

function getClient() {
  if (!g._mongoClient) {
    const c = new MongoClient(uri, { maxPoolSize: 5, maxIdleTimeMS: 10000 });
    attachDatabasePool(c);
    g._mongoClient = c;
  }
  return g._mongoClient;
}

// Drop the current client so the next request creates a fresh one
export function resetMongoClient() {
  const old = g._mongoClient;
  g._mongoClient = null;
  if (old) old.close().catch(() => {});
}

// Always points at the CURRENT client's database, never a dead one
export const db = new Proxy(
  {},
  {
    get(_target, prop) {
      const real = getClient().db();
      const value = real[prop];
      return typeof value === "function" ? value.bind(real) : value;
    },
  }
);