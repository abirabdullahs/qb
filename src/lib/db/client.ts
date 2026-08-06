import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "./schema";

// neon-serverless needs a WebSocket implementation outside the browser
// (Node.js server runtime — Next.js API routes / server components).
neonConfig.webSocketConstructor = ws;

// FIX: previously this file silently fell back to an in-memory mock DB
// whenever DATABASE_URL was missing or the connection failed. That made
// question creation/browsing appear to "succeed" while nothing was ever
// saved, with no error surfaced anywhere. We now fail loudly at startup
// instead — a missing/broken DB should be caught immediately, not
// discovered later as "my questions disappeared."
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env and fill it in — the app cannot run without a real database connection."
  );
}

// FIX: switched from the neon-http driver to neon-serverless (Pool-based).
// neon-http does not support real multi-statement transactions, which
// question creation needs (question + options/sub_parts + tags +
// attachments must succeed or fail together). neon-serverless keeps a
// pooled connection and supports db.transaction(...) properly.
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema });