import { Router } from 'express';
import { checkDatabaseConnection } from '@/database/pool.js';
import { asyncHandler } from '@/utils/asyncHandler.js';

export const healthRouter = Router();

/**
 * Not just "return 200" — this actually checks the DB connection too,
 * so this endpoint doubles as a real signal for uptime monitoring /
 * deployment health checks (Railway/Fly will hit this to know if the
 * container is ready to receive traffic).
 */
healthRouter.get(
  '/health',
  asyncHandler(async (_req, res) => {
    const dbHealthy = await checkDatabaseConnection();

    res.status(dbHealthy ? 200 : 503).json({
      status: dbHealthy ? 'ok' : 'degraded',
      database: dbHealthy ? 'connected' : 'unreachable',
      timestamp: new Date().toISOString(),
    });
  }),
);
