import { createResume } from "@/repositories/resume.repository.js";
import { Resume } from "@/types/database.types.js";
import { UnauthorisedError } from "@/utils/errors.js";
import { supabase } from '@/config/supabase.js';

// this is called/protected by auth middleware
export async function uploadResumeService(userId: string, file: Express.Multer.File): Promise<Resume> {
    const randomID = crypto.randomUUID()
    const storagePath = `resumes/${userId}/${randomID}-${file.originalname}`;

    try {
        const res = await supabase.storage.from('resumes').upload(storagePath, file.buffer, { contentType: file.mimetype });
        
        if (res.error) {
            // get rid of from db bc it couldnt be saved properly
            const remove = await supabase.storage.from('resumes').remove([storagePath]);
            throw new UnauthorisedError('File could not be saved to storage...');
        }
        
        const newRes = createResume(userId, storagePath, file.originalname);
        return newRes;

    } catch {
        // get rid of from db bc it couldnt be saved properly
        const remove = await supabase.storage.from('resumes').remove([storagePath]);
        throw new Error('File could not be saved to storage...');
    }

}