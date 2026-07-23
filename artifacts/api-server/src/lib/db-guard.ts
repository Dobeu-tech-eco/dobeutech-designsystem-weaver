import { db, isDatabaseConfigured } from "@workspace/db";
import { serviceUnavailable } from "./http-error";

type AppDb = NonNullable<typeof db>;

/**
 * Require a live DB handle. Throws 503 when DATABASE_URL is unset so routes
 * can degrade instead of crashing at module import.
 */
export function requireDb(): AppDb {
  if (!db || !isDatabaseConfigured) {
    throw serviceUnavailable(
      "Database unavailable: DATABASE_URL is not configured.",
    );
  }
  return db;
}

export { isDatabaseConfigured };
