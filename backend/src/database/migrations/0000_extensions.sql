-- gen_random_uuid() requires pgcrypto. Supabase projects usually have this
-- enabled by default, but we declare it explicitly so the migration is
-- self-contained and reproducible on any fresh Postgres instance.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Shared trigger function: any table with an `updated_at` column can attach
-- this trigger instead of every service having to remember to set it manually
-- on every UPDATE. One definition, reused across tables.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
