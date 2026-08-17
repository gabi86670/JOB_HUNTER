import { uploadResume } from "@/middleware/upload.middleware.js";
import { uploadResumeService } from "@/services/resumes/resume.service.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { Router } from "express";
import { authMiddleware } from '@/middleware/auth.middleware.js';
import { ValidationError } from "@/utils/errors.js";
export const resumeRouter = Router();

// parses the incoming file and calls uploadResumeService


// to init the uploading of resume to the db bucket + local memory
resumeRouter.post('/upload',
    // validate user before upload
    asyncHandler(authMiddleware),
    // check file can be uploaded
    uploadResume.single('resume'),
    asyncHandler(async (req, res) => {
        if (!req.file) {
            throw new ValidationError('Resume file is required');
        }
        // file successfully checked - ie its right size, saved in local memory etc
        const resume = await uploadResumeService(req.user.id, req.file);
        return res.status(201).json(resume); 
    })
);