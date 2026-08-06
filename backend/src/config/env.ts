import 'dotenv/config';
import { z } from 'zod';

/**
 * Every environment variable the app depends on is declared here, once.
 * If something is missing or malformed, we fail fast at startup with a
 * clear error — instead of getting a confusing runtime crash three
 * requests later when some deeply-nested service finally reads
 * `process.env.SOMETHING` and gets `undefined`.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  DATABASE_URL: z.string().url(),

  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  OPENAI_API_KEY: z.string().min(1),

  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables — see errors above.');
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
