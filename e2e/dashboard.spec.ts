import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
  });

  test('dashboard loads with welcome message', async ({ page }) => {
    await expect(page.locator('text=Willkommen zurück!')).toBeVisible();
  });

  test('stats cards are visible', async ({ page }) => {
    await expect(page.locator('text=Lebensläufe')).toBeVisible();
    await expect(page.locator('text=Anschreiben')).toBeVisible();
    await expect(page.locator('text=Profil-Vervollständigung')).toBeVisible();
  });

  test('quick start buttons work', async ({ page }) => {
    const newCVButton = page.locator('text=Neuer Lebenslauf');
    await expect(newCVButton).toBeVisible();
    await newCVButton.click();
    await expect(page.url()).toContain('/');
  });

  test('dashboard shows empty state for new users', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page.locator('text=Noch keine Lebensläufe')).toBeVisible();
  });
});
