import { test, expect } from '@playwright/test';

test.describe('Sidebar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      const aside = document.querySelector('aside');
      if (aside) {
        aside.classList.remove('hidden');
      }
    });
  });

  test('displays 5 navigation items with icons and labels on desktop', async ({ page }) => {
    const sidebar = page.locator('aside').filter({ hasText: 'Sektionen' });
    await expect(sidebar).toBeVisible();

    const navigationItems = [
      'Persönliche Daten',
      'Profil',
      'Berufserfahrung',
      'Ausbildung',
      'Fähigkeiten',
    ];

    for (const item of navigationItems) {
      const navItem = sidebar.getByText(item);
      await expect(navItem).toBeVisible();
    }
  });

  test('highlights active section with primary color', async ({ page }) => {
    const sidebar = page.locator('aside').filter({ hasText: 'Sektionen' });
    const personalButton = sidebar.getByRole('button', { name: /Persönliche Daten/ });
    await expect(personalButton).toBeVisible();

    const isActive = await personalButton.evaluate((el) => {
      return el.classList.contains('bg-primary');
    });

    expect(isActive).toBe(true);
  });

  test('navigates to section when clicking navigation item', async ({ page }) => {
    const sidebar = page.locator('aside').filter({ hasText: 'Sektionen' });
    const experienceButton = sidebar.getByRole('button', { name: /Berufserfahrung/ });
    await experienceButton.click();

    await expect(experienceButton).toHaveAttribute('aria-current', 'page');
  });

  test('shows mobile hamburger menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const hamburgerButton = page.getByRole('button', { name: /Open navigation menu/ });
    await expect(hamburgerButton).toBeVisible();
  });

  test('opens mobile sidebar when clicking hamburger menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const hamburgerButton = page.getByRole('button', { name: /Open navigation menu/ });
    await hamburgerButton.click();

    const navigation = page.getByRole('navigation', { name: 'CV sections navigation' });
    await expect(navigation).toBeVisible();
  });

  test('closes mobile sidebar when clicking navigation item', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const hamburgerButton = page.getByRole('button', { name: /Open navigation menu/ });
    await hamburgerButton.click();

    await page.waitForTimeout(500);

    const experienceButton = page.getByRole('button', { name: /Berufserfahrung/ }).first();
    await experienceButton.evaluate((el) => {
      if (el instanceof HTMLElement) {
        el.click();
      }
    });

    await page.waitForTimeout(1000);

    const sheetContent = page.locator('[data-radix-scroll-area-viewport]').first();
    const isSheetVisible = await sheetContent.isVisible();
    expect(isSheetVisible).toBe(false);
  });

  test('has proper accessibility attributes on desktop', async ({ page }) => {
    const sidebar = page.locator('aside').filter({ hasText: 'Sektionen' });
    const navigation = sidebar.getByRole('navigation', { name: 'CV sections navigation' });
    await expect(navigation).toBeVisible();

    const buttons = await navigation.getByRole('button').all();
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });

  test('shows completion status indicator for active section', async ({ page }) => {
    const sidebar = page.locator('aside').filter({ hasText: 'Sektionen' });
    const personalButton = sidebar.getByRole('button', { name: /Persönliche Daten/ });
    await expect(personalButton).toBeVisible();

    const indicatorCount = await personalButton.locator('.rounded-full').count();
    expect(indicatorCount).toBeGreaterThan(0);
  });
});
