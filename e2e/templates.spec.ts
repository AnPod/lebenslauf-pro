import { test, expect } from '@playwright/test';

test.describe('Template System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('template switcher is visible', async ({ page }) => {
    await expect(page.locator('[data-testid="template-switcher"]')).toBeVisible();
  });

  test('can switch between templates', async ({ page }) => {
    const templates = ['Modern', 'Klassisch', 'Minimal', 'Executive'];
    
    for (const template of templates) {
      const button = page.locator(`button:has-text("${template}")`);
      if (await button.isVisible().catch(() => false)) {
        await button.click();
        await page.waitForTimeout(300);
        await expect(page.locator('[data-testid="cv-preview"]')).toBeVisible();
      }
    }
  });

  test('template selection persists', async ({ page }) => {
    await page.locator('button:has-text("Modern")').click();
    await page.reload();
    await expect(page.locator('button[aria-pressed="true"]:has-text("Modern")')).toBeVisible();
  });
});
