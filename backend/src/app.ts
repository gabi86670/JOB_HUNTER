import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { env } from '@/config/env.js';
import { logger } from '@/utils/logger.js';
import { errorHandler } from '@/middleware/errorHandler.js';
import { healthRouter } from '@/routes/health.routes.js';
import { meRouter } from '@/routes/me.routes.js';
import { resumeRouter } from './routes/resume.routes.js';

/**
 * app.ts builds and returns the Express app but does NOT call app.listen().
 * Keeping those separate means we can import `app` directly into tests
 * (via supertest) without actually binding a port — server.ts is the only
 * file that starts the process for real.
 */
export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.use(healthRouter);

  // Future routers get mounted here, e.g.:
  // app.use('/resume', resumeRouter);
  // app.use('/jobs', jobsRouter);

  app.use(meRouter);
  app.use(resumeRouter);

  app.use(errorHandler);

  return app;
}
