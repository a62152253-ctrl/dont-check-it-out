import { test, expect } from '@playwright/test';

test('App starts up properly', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle('My Google AI Studio App');
});
