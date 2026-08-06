-- Mirrors resume_skills: many-to-many between jobs and the canonical
-- skills table. This is what the ranking engine actually joins against —
-- INTERSECT resume_skills.skill_id with job_skills.skill_id for a given
-- (resume, job) pair to compute skill overlap.
CREATE TABLE job_skills (
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (job_id, skill_id)
);

CREATE INDEX idx_job_skills_skill_id ON job_skills(skill_id);
