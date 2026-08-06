import pino from 'pino';
import { env } from '@/config/env.js';

/**
 * Central logger instance. Everything else in the app should import this
 * rather than calling console.log directly — that's what our lint rule
 * enforces. Pretty-printing in dev, raw JSON in prod (structured logs are
 * what you want when a log aggregator like Railway/Datadog is reading them).
 */
export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss' } }
      : undefined,
});
