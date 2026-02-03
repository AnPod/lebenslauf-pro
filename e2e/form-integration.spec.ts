import { test, expect } from '@playwright/test';

test.describe('Form Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      localStorage.clear();
      const aside = document.querySelector('aside');
      if (aside) {
        aside.classList.remove('hidden');
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      const aside = document.querySelector('aside');
      if (aside) {
        aside.classList.remove('hidden');
      }
    });
  });

  test('fills all required fields and verifies progress updates', async ({ page }) => {
    const firstName = page.locator('#firstName');
    const lastName = page.locator('#lastName');
    const email = page.locator('#email');

    await firstName.fill('Max');
    await lastName.fill('Mustermann');
    await email.fill('max.mustermann@email.de');

    await firstName.blur();
    await lastName.blur();
    await email.blur();

    const progressText = page.locator('aside').getByText(/Overall Progress/);
    await expect(progressText).toBeVisible();

    const progressPercentage = page.locator('aside').locator('text=/\\d+%/').first();
    await expect(progressPercentage).toBeVisible();
  });

  test('shows validation errors on blur for required fields', async ({ page }) => {
    const firstName = page.locator('#firstName');
    const lastName = page.locator('#lastName');
    const email = page.locator('#email');

    await firstName.focus();
    await firstName.blur();
    await page.waitForTimeout(100);

    const firstNameError = page.locator('#section-personal').getByText('Dieses Feld ist erforderlich');
    await expect(firstNameError).toBeVisible();

    await lastName.focus();
    await lastName.blur();
    await page.waitForTimeout(100);

    const lastNameError = page.locator('#section-personal').getByText('Dieses Feld ist erforderlich');
    await expect(lastNameError).toBeVisible();

    await email.focus();
    await email.blur();
    await page.waitForTimeout(100);

    const emailError = page.locator('#section-personal').getByText('Dieses Feld ist erforderlich');
    await expect(emailError).toBeVisible();
  });

  test('clears errors when fields become valid', async ({ page }) => {
    const firstName = page.locator('#firstName');
    const lastName = page.locator('#lastName');
    const email = page.locator('#email');

    await firstName.focus();
    await firstName.blur();
    await page.waitForTimeout(100);

    const firstNameError = page.locator('#section-personal').getByText('Dieses Feld ist erforderlich');
    await expect(firstNameError).toBeVisible();

    await firstName.fill('Max');
    await firstName.blur();
    await page.waitForTimeout(100);

    await expect(firstNameError).not.toBeVisible();

    await lastName.focus();
    await lastName.blur();
    await page.waitForTimeout(100);

    const lastNameError = page.locator('#section-personal').getByText('Dieses Feld ist erforderlich');
    await expect(lastNameError).toBeVisible();

    await lastName.fill('Mustermann');
    await lastName.blur();
    await page.waitForTimeout(100);

    await expect(lastNameError).not.toBeVisible();

    await email.focus();
    await email.blur();
    await page.waitForTimeout(100);

    const emailError = page.locator('#section-personal').getByText('Dieses Feld ist erforderlich');
    await expect(emailError).toBeVisible();

    await email.fill('max.mustermann@email.de');
    await email.blur();
    await page.waitForTimeout(100);

    await expect(emailError).not.toBeVisible();
  });

  test('validates email format', async ({ page }) => {
    const email = page.locator('#email');

    await email.fill('invalid-email');
    await email.blur();
    await page.waitForTimeout(100);

    const emailError = page.locator('#section-personal').getByText('Bitte geben Sie eine gültige E-Mail-Adresse ein');
    await expect(emailError).toBeVisible();

    await email.fill('max.mustermann@email.de');
    await email.blur();
    await page.waitForTimeout(100);

    await expect(emailError).not.toBeVisible();
  });

  test('validates minimum character requirement', async ({ page }) => {
    const firstName = page.locator('#firstName');

    await firstName.fill('M');
    await firstName.blur();
    await page.waitForTimeout(100);

    const firstNameError = page.locator('#section-personal').getByText('Mindestens 2 Zeichen erforderlich');
    await expect(firstNameError).toBeVisible();

    await firstName.fill('Max');
    await firstName.blur();
    await page.waitForTimeout(100);

    await expect(firstNameError).not.toBeVisible();
  });

  test('navigates via sidebar and scrolls to section', async ({ page }) => {
    const sidebar = page.locator('aside').filter({ hasText: 'Sektionen' });
    const experienceButton = sidebar.getByRole('button', { name: /Berufserfahrung/ });

    await experienceButton.click();

    const experienceSection = page.locator('#section-experience');
    await expect(experienceSection).toBeVisible();

    const sectionTop = await experienceSection.boundingBox();
    expect(sectionTop?.y).toBeLessThan(200);
  });

  test('adds experience entries', async ({ page }) => {
    const addExperienceButton = page.getByRole('button', { name: /Position hinzufügen/ });
    await addExperienceButton.click();

    const companyInput = page.getByPlaceholder('Unternehmen').first();
    await companyInput.fill('Tech Company');

    const positionInput = page.getByPlaceholder('Position').first();
    await positionInput.fill('Software Developer');

    await expect(companyInput).toHaveValue('Tech Company');
    await expect(positionInput).toHaveValue('Software Developer');
  });

  test('adds education entries', async ({ page }) => {
    const addEducationButton = page.getByRole('button', { name: /Ausbildung hinzufügen/ });
    await addEducationButton.click();

    const institutionInput = page.getByPlaceholder('Universität / Schule').first();
    await institutionInput.fill('Technical University');

    const degreeInput = page.getByPlaceholder('Bachelor, Master, etc.').first();
    await degreeInput.fill('Master of Science');

    await expect(institutionInput).toHaveValue('Technical University');
    await expect(degreeInput).toHaveValue('Master of Science');
  });

  test('adds skills', async ({ page }) => {
    const addSkillButton = page.getByRole('button', { name: /Fähigkeit hinzufügen/ });
    await addSkillButton.click();

    const skillInput = page.getByPlaceholder('Fähigkeit (z.B. Deutsch, Python)').first();
    await skillInput.fill('TypeScript');

    await expect(skillInput).toHaveValue('TypeScript');
  });

  test('persists data to localStorage', async ({ page }) => {
    const firstName = page.locator('#firstName');
    const lastName = page.locator('#lastName');
    const email = page.locator('#email');

    await firstName.fill('Max');
    await lastName.fill('Mustermann');
    await email.fill('max.mustermann@email.de');

    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(firstName).toHaveValue('Max');
    await expect(lastName).toHaveValue('Mustermann');
    await expect(email).toHaveValue('max.mustermann@email.de');
  });

  test('displays progress indicator in sidebar', async ({ page }) => {
    const sidebar = page.locator('aside').filter({ hasText: 'Sektionen' });
    const progressText = sidebar.getByText('Fortschritt');
    await expect(progressText).toBeVisible();

    const progressBar = sidebar.locator('.bg-primary').first();
    await expect(progressBar).toBeVisible();
  });

  test('mobile sidebar shows progress indicator', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const hamburgerButton = page.getByRole('button', { name: /Open navigation menu/ });
    await hamburgerButton.click();

    await page.waitForTimeout(500);

    const progressText = page.locator('[role="dialog"]').getByText('Fortschritt').first();
    await expect(progressText).toBeVisible();

    const progressBar = page.locator('[role="dialog"]').locator('.bg-primary').first();
    await expect(progressBar).toBeVisible();
  });

  test('all form sections are visible and accessible', async ({ page }) => {
    const sections = [
      'section-personal',
      'section-profile',
      'section-experience',
      'section-education',
      'section-skills',
    ];

    for (const sectionId of sections) {
      const section = page.locator(`#${sectionId}`);
      await expect(section).toBeVisible();
    }
  });

  test('switch toggle works for current position', async ({ page }) => {
    const addExperienceButton = page.getByRole('button', { name: /Position hinzufügen/ });
    await addExperienceButton.click();

    const currentSwitch = page.getByRole('switch', { name: /Aktuelle Position/ });
    await currentSwitch.check();

    const isChecked = await currentSwitch.isChecked();
    expect(isChecked).toBe(true);

    await currentSwitch.uncheck();

    const isUnchecked = await currentSwitch.isChecked();
    expect(isUnchecked).toBe(false);
  });

  test('skill category changes level options', async ({ page }) => {
    const addSkillButton = page.getByRole('button', { name: /Fähigkeit hinzufügen/ });
    await addSkillButton.click();

    const categorySelect = page.locator('select').filter({ hasText: /Technisch/ }).first();
    await categorySelect.selectOption('language');

    const levelSelect = page.locator('select').filter({ hasText: /Gut/ }).first();
    const a1Option = levelSelect.locator('option[value="A1"]');
    await expect(a1Option).toHaveCount(1);
  });
});
