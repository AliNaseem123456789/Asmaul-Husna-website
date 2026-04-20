// src/lib/db.ts
import { Pool } from "pg";

// This check prevents creating a new pool on every hot-reload in development
const globalForDb = global as unknown as { pool: Pool };

export const pool =
  globalForDb.pool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;
