import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/pages',
  outputDir: './test-results/pages',
  use: { baseURL: 'http://127.0.0.1:5181/machetico-ui/' },
  webServer: {
    command: 'node scripts/serve-pages-test.mjs',
    url: 'http://127.0.0.1:5181/machetico-ui/',
    reuseExistingServer: false,
  },
});
