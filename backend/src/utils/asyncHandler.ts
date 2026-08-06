import type { NextFunction, Request, Response } from 'express';

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Wraps an async Express handler so a thrown/rejected error is forwarded
 * to next() automatically, instead of every controller needing its own
 * try/catch just to call next(err). This is also what makes our
 * `no-floating-promises` lint rule happy on route handlers.
 */
export function asyncHandler(fn: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
