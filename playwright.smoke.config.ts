import { defineConfig, devices } from '@playwright/test';
const BASE = process.env.BASE_URL ?? 'https://carrerable.github.io';
const local = BASE.startsWith('http://localhost');
export default defineConfig({
  testDir: 'tests/smoke',
  timeout: 120_000,
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report/smoke' }]],
  use: { ...devices['Desktop Chrome'], reducedMotion: 'reduce' },
  webServer: local ? { command: 'npm run preview -- --port 4321', url: 'http://localhost:4321/en/', reuseExistingServer: true, timeout: 60_000 } : undefined,
});
