-- Many-to-many: a resume has many skills, a skill appears on many resumes.
-- Composite primary key means "this resume has this skill" can only exist
-- once — no separate surrogate ID needed for a pure join table.
CREATE TABLE resume_skills (
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (resume_id, skill_id)
);

-- The PK above already covers lookups by resume_id (it's the leading
-- column), but we also need the reverse direction efficiently — e.g.
-- "which resumes have skill X" — hence a separate index on skill_id.
CREATE INDEX idx_resume_skills_skill_id ON resume_skills(skill_id);
