import  { pool } from '@/database/pool.js';
import { Resume, ResumeStatus, ResumeExperienceEntry, ResumeEducationEntry, ResumeProjectEntry } from '@/types/database.types.js';

interface ResumeRow {
    id: string;
    user_id: string;
    storage_path: string;
    original_filename: string;
    status: ResumeStatus;
    experience: ResumeExperienceEntry[] | null;
    education: ResumeEducationEntry[] | null;
    projects: ResumeProjectEntry[] | null;
    graduation_date: string | null;
    parsed_at: Date | null;
    created_at: Date;
    updated_at: Date;
}


export async function createResume(userId: string, storagePath: string, originalFilename: string): Promise<Resume> {
    const res = await pool.query<ResumeRow>(
        "INSERT INTO resumes (user_id, storage_path, original_filename) values ($1, $2, $3) RETURNING *",
        [userId, storagePath, originalFilename]
    );

    const row = res.rows[0];
    // plain error bc means smth went wrong w db or weird code err
    if (!row) {
        throw new Error('Resume insert returned no row — this should never happen');
    }

    const rsme: Resume = {
        id: row.id,
        userId: row.user_id,
        storagePath: row.storage_path,
        originalFilename: row.original_filename,
        status: row.status,
        experience: row.experience,
        education: row.education,
        projects: row.projects,
        graduationDate: row.graduation_date,
        parsedAt: row.parsed_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
    
    return rsme;

};