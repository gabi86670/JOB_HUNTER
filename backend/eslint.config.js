// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    // Root-level config files (vitest.config.ts, etc.) sit outside
    // tsconfig.json's `include` (which only covers src/**/*.ts), so
    // type-aware linting has no TS project to check them against.
    // Regular (non-type-aware) linting still applies - this only turns
    // off the rules that specifically need full type information.
    files: ['*.config.ts', 'vitest.setup.ts'],
    ...tseslint.configs.disableTypeChecked,
  },
  prettierConfig,
);
