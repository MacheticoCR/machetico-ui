import { defineConfig } from '@playwright/test';
const port = Number(process.env.MACHETICO_TEST_PORT ?? 5180);
export default defineConfig({
  testDir: './e2e',
  use: { baseURL: `http://127.0.0.1:${port}` },
  webServer: {
    command: 'npm run demo',
    url: `http://127.0.0.1:${port}/components`,
    env: { MACHETICO_DEMO_PORT: String(port) },
    reuseExistingServer: false,
    timeout: 120000,
  },
});
