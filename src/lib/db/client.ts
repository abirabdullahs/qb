import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type GlobalWithDb = typeof globalThis & {
  __qbDbInstance?: ReturnType<typeof drizzle>;
};

// FIX: the previous Neon setup relied on a WebSocket-based pool and a
// direct ws dependency. That path is fragile in Vercel serverless
// environments and can crash the function process after the HTTP response
// has already been sent. The HTTP driver is the serverless-safe choice for
// Next.js API routes and preserves the normal read/write behavior.
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env and fill it in — the app cannot run without a real database connection."
  );
}

const globalForDb = globalThis as GlobalWithDb;
const sql = neon(process.env.DATABASE_URL);

export const db = globalForDb.__qbDbInstance ?? (globalForDb.__qbDbInstance = drizzle(sql, { schema }));