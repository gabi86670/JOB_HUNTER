/**
 * Runs before any test file's imports. Tests should never depend on real
 * secrets existing — even loading a mocked module (like user.repository)
 * pulls in env.ts transitively via pool.ts, and env.ts throws if the
 * environment isn't valid. These are throwaway values that satisfy Zod's
 * shape checks; nothing here ever makes a real network/DB call in tests.
 */
process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SECRET_KEY = 'test-secret-key';
process.env.OPENAI_API_KEY = 'sk-test';
process.env.CORS_ORIGIN = 'http://localhost:5173';