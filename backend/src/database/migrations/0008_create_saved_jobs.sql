-- Many-to-many between users and jobs — a user can save many jobs,
-- a job can be saved by many users. Composite PK, no separate ID needed.
CREATE TABLE saved_jobs (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, job_id)
);
