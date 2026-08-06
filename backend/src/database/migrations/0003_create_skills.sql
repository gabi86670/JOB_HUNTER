-- The canonical skill/technology list. Both resumes and jobs reference
-- this table rather than storing free-text skill strings, which is what
-- lets the ranking engine do a real set intersection ("how many of the
-- job's required skills does this resume have?") instead of fuzzy string
-- matching "React" vs "ReactJS" vs "React.js" at query time.
--
-- `category` distinguishes soft/general skills from specific technologies
-- purely for display grouping — matching logic treats them the same way.
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'skill'
    CHECK (category IN ('skill', 'technology')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Case-insensitive lookups are the common case (matching AI-extracted
-- text against the canonical list), so index the lowercase form.
CREATE INDEX idx_skills_name_lower ON skills(lower(name));
