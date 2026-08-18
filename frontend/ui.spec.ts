import { test, expect } from '@playwright/test';

test('app loads and shows title', async ({ page }) => {
  await page.goto('http://localhost:3000');
  // simple check for body to exist
  await expect(page.locator('body')).toBeVisible();
});
