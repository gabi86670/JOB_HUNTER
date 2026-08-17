import { authMiddleware } from '@/middleware/auth.middleware.js';
import { asyncHandler } from '@/utils/asyncHandler.js';
import { Router } from 'express';

export const meRouter = Router();

meRouter.get('/me',
    // passing middleware fn into another fn
    // pretty much if it returns an err then handles that separately
    asyncHandler(authMiddleware),
    (req, res) => {

    // at this pt user alr avaialble
    return res.status(200).json(req.user); 
  }
);   