import { defineConfig } from 'vitest/config';
import path from 'node:path';

/**
 * Vitest doesn't automatically read tsconfig.json's `paths` — that's a
 * TypeScript-compiler-only concept. Since our source imports everywhere
 * use the `@/*` alias, we mirror the same mapping here so tests can
 * import modules the exact same way the app does.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});