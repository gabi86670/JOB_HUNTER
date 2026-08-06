import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '@/utils/errors.js';
import { logger } from '@/utils/logger.js';

/**
 * Single place where every error in the app gets turned into an HTTP
 * response. Must be registered LAST, after all routes, per Express's
 * error-middleware convention (4 args signals "this is an error handler").
 */
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'ValidationError',
      message: 'Invalid request data',
      details: err.flatten().fieldErrors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
    return;
  }

  // Anything else is unexpected — log the full error for ourselves,
  // but never leak internals (stack traces, DB errors, etc.) to the client.
  logger.error({ err, path: req.path, method: req.method }, 'Unhandled error');
  res.status(500).json({
    error: 'InternalServerError',
    message: 'Something went wrong.',
  });
}
