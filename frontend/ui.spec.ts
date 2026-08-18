import { test, expect } from '@playwright/test';

test('app loaded', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  const title = await page.title();
  console.log('Page title:', title);
});
