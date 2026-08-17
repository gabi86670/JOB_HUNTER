import { UnauthorisedError } from "@/utils/errors.js";
import multer, { FileFilterCallback } from "multer";
import type { Request } from 'express';

// puts resumE in memoryStorage as a buffer before pushing straight
// to supabase storage bucket resumes

// callbacj signals accept or reject
function filterFile(req: Request, file: Express.Multer.File, callback: FileFilterCallback): void {
    if (file.mimetype === "application/pdf") {
        callback(null, true);
        return;
    }
    callback(new UnauthorisedError('File must be a PDF'));
};

export const uploadResume = multer({
    // holds aas buffer in memory --> req.file.buffer
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024  /* 5MB-in-bytes calc */ },
    fileFilter: filterFile,
});