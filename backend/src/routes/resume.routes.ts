import { uploadResume } from "@/middleware/upload.middleware.js";
import { uploadResumeService } from "@/services/resumes/resume.service.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { Router } from "express";
import { authMiddleware } from '@/middleware/auth.middleware.js';

export const resumeRouter = Router();

// parses the incoming file and calls uploadResumeService


// to init the uploading of resume to the db bucket + local memory
resumeRouter.post('/upload',
    asyncHandler(authMiddleware),
    asyncHandler(uploadResume.single('resume')),
    (req, file, callback) => {
        // file successfully checked - ie its right size, saved in local memory etc
        const res = uploadResumeService(req.user.id, req.file);
        return res.status(200).json(req.data); 
    }
);