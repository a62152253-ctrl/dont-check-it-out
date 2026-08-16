import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './frontend',
  use: {
    browserName: 'chromium',
    headless: true,
    video: 'on',
    screenshot: 'on',
  },
});
