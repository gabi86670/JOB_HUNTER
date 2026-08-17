import { createResume } from "@/repositories/resume.repository.js";
import { Resume } from "@/types/database.types.js";
import { supabaseClient } from '@/config/supabase.js';
// import { logger } from "@/utils/logger.js";

// this is called/protected by auth middleware
export async function uploadResumeService(userId: string, file: Express.Multer.File): Promise<Resume> {
    const randomID = crypto.randomUUID()
    const storagePath = `resumes/${userId}/${randomID}-${file.originalname}`;

    const res = await supabaseClient.storage.from('resumes').upload(storagePath, file.buffer, { contentType: file.mimetype });
        
    if (res.error) {
        // logger.error({ error: res.error }, 'Storage upload failed');
        // never saved from db - plain errors bc went wrong on our end
        throw new Error('File could not be saved to storage...');
    }

    try {
        const newRes = await createResume(userId, storagePath, file.originalname);
        return newRes;

    } catch {
        await supabaseClient.storage.from('resumes').remove([storagePath]);
        throw new Error('Database could not parse resume. Removing resume from storage, please re-upload');
    }
}