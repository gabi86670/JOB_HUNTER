-- One user can have multiple resumes over time (updated CV, tailored
-- versions per application round) — this is one-to-many, not a column
-- on `users`.
--
-- `experience`, `education`, and `projects` are stored as JSONB rather
-- than normalized tables. These are read-mostly, displayed-to-the-user,
-- variable-shaped data (a role might have 3 bullet points or 10; an
-- education entry might have a GPA or not) — normalizing them buys
-- little query benefit and costs real schema rigidity. Skills are the
-- one field the ranking engine actually needs to query/join against,
-- so skills gets its own normalized tables (see 0003, 0004).
--
-- `status` tracks the resume through the async parse pipeline: a file
-- is uploaded (pending) before the AI parser has run (parsing), and
-- ends up parsed or failed. The API can poll this instead of blocking
-- the upload request on a slow AI call.
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  storage_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'parsing', 'parsed', 'failed')),

  experience JSONB,
  education JSONB,
  projects JSONB,
  graduation_date DATE,

  parsed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_resumes_user_id ON resumes(user_id);

CREATE TRIGGER resumes_set_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
