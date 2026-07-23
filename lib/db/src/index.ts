import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";

/** True when a Postgres connection string is available. */
export const isDatabaseConfigured = databaseUrl.length > 0;

/**
 * Graceful DB boot: when DATABASE_URL is unset, `db`/`pool` stay null and API
 * routes return empty lists / 503 instead of crashing at import.
 *
 * Neon HTTP: preferred for Vercel/WebContainers, but a static dual-import of
 * `drizzle-orm/neon-http` + `node-postgres` splits drizzle-orm peers under pnpm
 * and breaks TypeScript. Keep the Replit `pg` path as the typed driver. To use
 * Neon later: add `@neondatabase/serverless`, set DB_DRIVER=neon-http, and load
 * neon-http via a dedicated entry that does not co-import node-postgres types.
 * Auto-detect hint: `*.neon.tech` URLs (documented in PRODUCTION_PLAN / BOLT_SETUP).
 */
export type AppDb = ReturnType<typeof drizzle<typeof schema>>;

export let pool: pg.Pool | null = null;
export let db: AppDb | null = null;

if (isDatabaseConfigured) {
  pool = new Pool({ connectionString: databaseUrl });
  db = drizzle(pool, { schema });
}

export * from "./schema";
