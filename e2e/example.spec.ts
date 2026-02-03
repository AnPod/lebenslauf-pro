import { test, expect } from '@playwright/test';

test('example E2E test - page loads', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Lebenslauf/);
  await expect(page.locator('body')).toBeVisible();
});
