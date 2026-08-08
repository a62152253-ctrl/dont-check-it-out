import { test, expect } from '@playwright/test';

test('App loads successfully and takes screenshot', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'frontend_screenshot.png' });
});
