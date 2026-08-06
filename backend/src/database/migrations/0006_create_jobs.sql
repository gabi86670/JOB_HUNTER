-- One row per job posting, sourced from a provider (Greenhouse, Lever,
-- etc — see the JobProvider interface in services/jobs/providers).
--
-- UNIQUE (source, external_id) is the dedup key: re-running a search
-- against the same provider should UPSERT existing postings rather than
-- create duplicate rows every time the job search runs.
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  source TEXT NOT NULL,
  external_id TEXT NOT NULL,

  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  remote_type TEXT NOT NULL DEFAULT 'unknown'
    CHECK (remote_type IN ('remote', 'hybrid', 'onsite', 'unknown')),
  employment_type TEXT,

  description TEXT NOT NULL,
  url TEXT NOT NULL,

  posted_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (source, external_id)
);

CREATE INDEX idx_jobs_company ON jobs(company);
CREATE INDEX idx_jobs_fetched_at ON jobs(fetched_at DESC);
