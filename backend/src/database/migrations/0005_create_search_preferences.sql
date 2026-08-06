-- One ACTIVE preference set per user (enforced by the UNIQUE constraint
-- on user_id) rather than a history of preference versions. The product
-- requirement is "the user's current job search criteria," not "every
-- preference set they've ever had" — versioning that would be
-- over-engineering for what the ranking engine actually needs to read.
-- The service layer does this as an upsert: update if a row exists,
-- insert if it's the user's first time setting preferences.
--
-- Arrays (roles, locations, employment_types) instead of a join table:
-- these are short, user-entered lists with no need for referential
-- integrity against a canonical lookup (unlike skills, which the ranking
-- engine matches against a controlled vocabulary). Postgres arrays are a
-- reasonable fit for "a small list of strings the user typed."
CREATE TABLE search_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  roles TEXT[] NOT NULL DEFAULT '{}',
  locations TEXT[] NOT NULL DEFAULT '{}',
  employment_types TEXT[] NOT NULL DEFAULT '{}',

  remote_preference TEXT NOT NULL DEFAULT 'any'
    CHECK (remote_preference IN ('remote', 'hybrid', 'onsite', 'any')),
  willing_to_relocate BOOLEAN NOT NULL DEFAULT false,
  min_salary INTEGER,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER search_preferences_set_updated_at
  BEFORE UPDATE ON search_preferences
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
