-- `users` is a PROFILE table, not an auth table. Supabase Auth owns
-- credentials in its own `auth.users` table — we never touch passwords,
-- sessions, or tokens ourselves. This table extends that identity with
-- app-specific data, keyed 1:1 by the same UUID Supabase Auth issues.
--
-- ON DELETE CASCADE: if a user's auth record is deleted, their profile
-- (and everything that references it) is cleaned up automatically rather
-- than leaving orphaned rows.
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
