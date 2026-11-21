import { MongoClient } from "mongodb";

const uri = process.env.DB_URI;
if (!uri) throw new Error("Missing DB_URI in .env.local");

const globalForMongo = globalThis;

if (!globalForMongo._mongoClient) {
  globalForMongo._mongoClient = new MongoClient(uri, { maxPoolSize: 5, maxIdleTimeMS: 30000 });
}

export const client = globalForMongo._mongoClient;
export const db = client.db();