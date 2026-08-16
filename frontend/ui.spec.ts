import { test, expect } from '@playwright/test';

test('Verify App Loads', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveTitle(/My Google AI Studio App/i);
});
