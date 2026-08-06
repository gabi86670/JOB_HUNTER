import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '@/database/pool.js';
import { logger } from '@/utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, 'migrations');

/**
 * A deliberately small migration runner: track which .sql files (by name)
 * have already run in a `schema_migrations` table, then apply any new
 * ones — in filename order, each wrapped in its own transaction so a
 * failure partway through a file rolls that file back cleanly.
 *
 * This is what tools like node-pg-migrate or Prisma Migrate do under the
 * hood, minus the bells and whistles (no rollback/"down" migrations here —
 * for a project this size, fixing forward with a new migration file is
 * simpler and safer than maintaining a down-migration for every up).
 */
async function runMigrations(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  const { rows: appliedRows } = await pool.query<{ name: string }>(
    'SELECT name FROM schema_migrations',
  );
  const applied = new Set(appliedRows.map((r) => r.name));

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const pending = files.filter((f) => !applied.has(f));

  if (pending.length === 0) {
    logger.info('No pending migrations — database is up to date.');
    return;
  }

  for (const file of pending) {
    const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
      await client.query('COMMIT');
      logger.info(`✅ Applied migration: ${file}`);
    } catch (err) {
      await client.query('ROLLBACK');
      logger.error({ err }, `❌ Failed to apply migration: ${file}`);
      throw err;
    } finally {
      client.release();
    }
  }

  logger.info(`Migrations complete — ${pending.length} applied.`);
}

runMigrations()
  .then(() => pool.end())
  .catch((err: unknown) => {
    logger.error({ err }, 'Migration run failed');
    void pool.end().finally(() => process.exit(1));
  });
