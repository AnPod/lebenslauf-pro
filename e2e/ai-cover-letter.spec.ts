import { test, expect } from '@playwright/test';

test.describe('AI Cover Letter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.locator('text=Anschreiben').click();
  });

  test('tone selection is available', async ({ page }) => {
    const toneSelect = page.locator('[data-testid="tone-select"]');
    await expect(toneSelect).toBeVisible();
  });

  test('cannot generate without consent', async ({ page }) => {
    await page.fill('[data-testid="company-input"]', 'Test GmbH');
    await page.fill('[data-testid="position-input"]', 'Developer');
    await page.fill('[data-testid="job-description"]', 'Test description');
    
    const generateButton = page.locator('button:has-text("Anschreiben generieren")');
    await expect(generateButton).toBeDisabled();
  });

  test('can generate with consent checked', async ({ page }) => {
    await page.fill('[data-testid="company-input"]', 'Test GmbH');
    await page.fill('[data-testid="position-input"]', 'Developer');
    await page.fill('[data-testid="job-description"]', 'Test description');
    await page.locator('[data-testid="consent-checkbox"]').check();
    
    const generateButton = page.locator('button:has-text("Anschreiben generieren")');
    await expect(generateButton).toBeEnabled();
  });

  test('PII redaction notice is shown', async ({ page }) => {
    await expect(page.locator('text=persönlichen Daten werden geschützt')).toBeVisible();
  });
});
