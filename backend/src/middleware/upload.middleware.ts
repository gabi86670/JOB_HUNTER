import { UnauthorisedError } from "@/utils/errors.js";
import multer, { FileFilterCallback } from "multer";

// puts resumt in memoryStorage as a buffer before pushing straight
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
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 10^6/* your 5MB-in-bytes calc */ },
    fileFilter: filterFile,
});