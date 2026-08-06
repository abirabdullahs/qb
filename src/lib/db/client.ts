import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let db: any;
let isMockDb = false;

function createMockDb() {
  const createChainable = (): any => {
    const fn = () => createChainable();
    return new Proxy(fn, {
      get: (_, prop) => {
        if (prop === 'then') {
          return (resolve: any) => resolve([]);
        }
        return createChainable();
      },
      apply: () => createChainable(),
    });
  };

  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    delete: async () => ({}),
  };

  return new Proxy(
    {},
    {
      get: (_, prop) => {
        if (prop === 'query') {
          return new Proxy({}, { get: () => noOp });
        }
        return createChainable();
      },
    }
  );
}

try {
  if (process.env.DATABASE_URL) {
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema });
  } else {
    throw new Error("DATABASE_URL is not set.");
  }
} catch {
  console.warn('[AI Studio] Database not connected — using mock client');
  db = createMockDb();
  isMockDb = true;
}

export { db, isMockDb };
