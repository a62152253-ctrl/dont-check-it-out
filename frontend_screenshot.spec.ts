import { test, expect } from '@playwright/test';

test('screenshot of new dashboard design', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'dashboard-new-design.png', fullPage: true });
});
