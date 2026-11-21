import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.DB_URI;
if (!uri) throw new Error("Missing DB_URI in .env.local");

const globalForMongo = globalThis;

if (!globalForMongo._mongoClient) {
  const mongoClient = new MongoClient(uri, {
    maxPoolSize: 5,
    maxIdleTimeMS: 10000,
  });
  // Vercel closes idle connections before the function is paused
  attachDatabasePool(mongoClient);
  globalForMongo._mongoClient = mongoClient;
}

export const client = globalForMongo._mongoClient;
export const db = client.db();