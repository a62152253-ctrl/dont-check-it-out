import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  use: {
    trace: 'on-first-retry',
    video: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
