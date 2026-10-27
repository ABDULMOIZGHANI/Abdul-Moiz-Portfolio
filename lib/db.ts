import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

/** True when a MongoDB connection string is configured. Without it the site runs on /data JSON. */
export const hasDb = Boolean(uri);

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
// Reuse one connection across hot reloads and requests.
const g = globalThis as unknown as { _mongoose?: Cache };
const cache: Cache = g._mongoose ?? (g._mongoose = { conn: null, promise: null });

export async function db() {
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (cache.conn) return cache.conn;
  cache.promise ??= mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 8000 });
  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null; // allow a retry on the next request
    throw err;
  }
  return cache.conn;
}
