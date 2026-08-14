-- RLS: re-assert lockdown of Supabase's auto-generated public API.
-- Safe to run even if you already enabled this via the
-- Supabase dashboard. No policies are added on purpose: our Express
-- backend uses the secret key, which bypasses RLS entirely, so the
-- public API stays fully locked either way.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;



-- resumes

ALTER TABLE resumes ADD CONSTRAINT chk_resumes_storage_path_len
  CHECK (length(trim(storage_path)) > 0 AND length(storage_path) <= 500);

ALTER TABLE resumes ADD CONSTRAINT chk_resumes_filename_len
  CHECK (length(trim(original_filename)) > 0 AND length(original_filename) <= 255);

-- weak check - trivially spoofable by renaming a file's
-- extension. Real protection is validating actual file content/MIME type
-- in the upload handler (a later milestone), not the filename.
ALTER TABLE resumes ADD CONSTRAINT chk_resumes_filename_ext
  CHECK (original_filename ~* '\.(pdf|doc|docx)$');

ALTER TABLE resumes ADD CONSTRAINT chk_resumes_graduation_date_range
  CHECK (graduation_date IS NULL
    OR graduation_date BETWEEN '1960-01-01' AND (now() + interval '12 years'));

-- The app always expects these as JSON ARRAYS when present - blocks a
-- malformed AI response from being stored and crashing whatever reads it.
ALTER TABLE resumes ADD CONSTRAINT chk_resumes_experience_is_array
  CHECK (experience IS NULL OR jsonb_typeof(experience) = 'array');
ALTER TABLE resumes ADD CONSTRAINT chk_resumes_education_is_array
  CHECK (education IS NULL OR jsonb_typeof(education) = 'array');
ALTER TABLE resumes ADD CONSTRAINT chk_resumes_projects_is_array
  CHECK (projects IS NULL OR jsonb_typeof(projects) = 'array');


-- skills

ALTER TABLE skills ADD CONSTRAINT chk_skills_name_len
  CHECK (length(trim(name)) > 0 AND length(name) <= 100);


-- search_preferences

-- Cardinality caps stop a malicious/buggy client submitting huge arrays.
-- Per-element validation is a Zod job at the API boundary, not the DBs.
ALTER TABLE search_preferences ADD CONSTRAINT chk_prefs_roles_count
  CHECK (array_length(roles, 1) IS NULL OR array_length(roles, 1) <= 20);
ALTER TABLE search_preferences ADD CONSTRAINT chk_prefs_locations_count
  CHECK (array_length(locations, 1) IS NULL OR array_length(locations, 1) <= 20);
ALTER TABLE search_preferences ADD CONSTRAINT chk_prefs_employment_types_count
  CHECK (array_length(employment_types, 1) IS NULL OR array_length(employment_types, 1) <= 15);

ALTER TABLE search_preferences ADD CONSTRAINT chk_prefs_min_salary_range
  CHECK (min_salary IS NULL OR (min_salary >= 0 AND min_salary <= 10000000));


-- jobs

-- Enforces FORMAT (lowercase slug) without hardcoding the exact provider
-- list - stays open to future providers without needing a new migration.
ALTER TABLE jobs ADD CONSTRAINT chk_jobs_source_format
  CHECK (source ~ '^[a-z_]+$' AND length(source) <= 50);

ALTER TABLE jobs ADD CONSTRAINT chk_jobs_external_id_len
  CHECK (length(trim(external_id)) > 0 AND length(external_id) <= 255);

ALTER TABLE jobs ADD CONSTRAINT chk_jobs_title_len
  CHECK (length(trim(title)) > 0 AND length(title) <= 300);

ALTER TABLE jobs ADD CONSTRAINT chk_jobs_company_len
  CHECK (length(trim(company)) > 0 AND length(company) <= 200);

ALTER TABLE jobs ADD CONSTRAINT chk_jobs_location_len
  CHECK (location IS NULL OR length(location) <= 200);

ALTER TABLE jobs ADD CONSTRAINT chk_jobs_description_len
  CHECK (length(description) <= 50000);

ALTER TABLE jobs ADD CONSTRAINT chk_jobs_url_format
  CHECK (url ~* '^https?://' AND length(url) <= 1000);

ALTER TABLE jobs ADD CONSTRAINT chk_jobs_posted_at_range
  CHECK (posted_at IS NULL OR posted_at <= now() + interval '7 days');