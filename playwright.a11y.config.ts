import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/a11y',
  timeout: 60_000,
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report/a11y' }]],
  use: { baseURL: 'http://localhost:4321', reducedMotion: 'reduce' },
  projects: [
    { name: 'light', use: { ...devices['Desktop Chrome'], colorScheme: 'light' } },
    { name: 'dark', use: { ...devices['Desktop Chrome'], colorScheme: 'dark' } },
  ],
  webServer: { command: 'npm run preview -- --port 4321', url: 'http://localhost:4321/en/', reuseExistingServer: !process.env.CI, timeout: 60_000 },
});
