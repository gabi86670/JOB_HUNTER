import { Pool } from 'pg';
import { env } from '@/config/env.js';
import { logger } from '@/utils/logger.js';

/**
 * A single shared connection pool for the whole app. `pg` manages a set of
 * open connections and hands them out per-query — we do NOT want to open a
 * new connection per request, that's how you exhaust Postgres' connection
 * limit under any real load.
 *
 * This is the ONLY file that should import `pg` directly. Repositories
 * import `pool` from here; nothing above the repository layer should ever
 * touch raw SQL.
 */
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
});

pool.on('error', (err) => {
  // Fired when an idle client in the pool errors out (e.g. connection
  // dropped by the DB). This is NOT a per-query error — those are handled
  // where the query is made. This is for background pool health.
  logger.error({ err }, 'Unexpected error on idle Postgres client');
});

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (err) {
    logger.error({ err }, 'Database connection check failed');
    return false;
  }
}
