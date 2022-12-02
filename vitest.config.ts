/// <reference types="vitest" />

import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 30000,
    exclude: [...configDefaults.exclude, './sso-cdk/**'],
  },
  logLevel: 'info',
  esbuild: {
    sourcemap: 'both',
  },
  resolve: {
    alias: {
      '@family-box/core': './services/core',
      '@family-box/utils': './services/utils',
    },
  },
});
