/**
 * Hand-written types mirroring the DB schema (see database/migrations).
 * We're not generating these from an ORM — writing them by hand while the
 * schema is still small keeps the mental model of "what's actually in
 * Postgres" explicit, and repositories return exactly these shapes.
 */

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ResumeStatus = 'pending' | 'parsing' | 'parsed' | 'failed';

export interface ResumeExperienceEntry {
  company: string;
  title: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

export interface ResumeEducationEntry {
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface ResumeProjectEntry {
  name: string;
  description: string;
  technologies: string[];
}

export interface Resume {
  id: string;
  userId: string;
  storagePath: string;
  originalFilename: string;
  status: ResumeStatus;
  experience: ResumeExperienceEntry[] | null;
  education: ResumeEducationEntry[] | null;
  projects: ResumeProjectEntry[] | null;
  graduationDate: string | null;
  parsedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type SkillCategory = 'skill' | 'technology';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  createdAt: Date;
}

export type RemotePreference = 'remote' | 'hybrid' | 'onsite' | 'any';

export interface SearchPreference {
  id: string;
  userId: string;
  roles: string[];
  locations: string[];
  employmentTypes: string[];
  remotePreference: RemotePreference;
  willingToRelocate: boolean;
  minSalary: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type RemoteType = 'remote' | 'hybrid' | 'onsite' | 'unknown';

export interface Job {
  id: string;
  source: string;
  externalId: string;
  title: string;
  company: string;
  location: string | null;
  remoteType: RemoteType;
  employmentType: string | null;
  description: string;
  url: string;
  postedAt: Date | null;
  fetchedAt: Date;
}

export interface SavedJob {
  userId: string;
  jobId: string;
  savedAt: Date;
}
