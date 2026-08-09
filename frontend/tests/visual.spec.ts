import { test, expect } from '@playwright/test';

test('Frontend UI Loads', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'frontend-screenshot.png' });
});
