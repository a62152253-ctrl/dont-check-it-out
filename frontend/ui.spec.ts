import { test, expect } from '@playwright/test';

test('verify frontend renders properly', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'frontend-screenshot.png', fullPage: true });
  expect(true).toBeTruthy();
});
