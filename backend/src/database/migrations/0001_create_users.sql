-- `users` is a PROFILE table, not an auth table. Supabase Auth owns
-- credentials in its own `auth.users` table - we never touch passwords,
-- sessions, or tokens ourselves. This table extends that identity with
-- app-specific data, keyed 1:1 by the same UUID Supabase Auth issues.
--
-- ON DELETE CASCADE: if a user's auth record is deleted, their profile
-- (and everything that references it) is cleaned up automatically rather
-- than leaving orphaned rows.

-- UUID = universally unique identifier, a 128-bit value that is statistically 
-- guaranteed to be unique across all systems and time. Supabase Auth uses UUIDs
--  for user IDs, so we use them here too.
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE CHECK (length(email) <= 70) CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  name_first TEXT CHECK (length(name_first) <= 50),
  name_last TEXT CHECK (length(name_last) <= 50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- make sure updated_at is always set to the current timestamp when a row is updated
CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
