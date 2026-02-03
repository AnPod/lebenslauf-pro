import { test, expect } from '@playwright/test';

test.describe('Drag & Drop Reordering', () => {
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

  test('keyboard reorders experience entries with up/down buttons', async ({ page }) => {
    const addExperienceButton = page.getByRole('button', { name: /Position hinzufügen/ });

    await addExperienceButton.click();
    await addExperienceButton.click();

    const companyInputs = page.getByPlaceholder('Unternehmen');
    await companyInputs.nth(0).fill('Company A');
    await companyInputs.nth(1).fill('Company B');

    await expect(companyInputs.nth(0)).toHaveValue('Company A');
    await expect(companyInputs.nth(1)).toHaveValue('Company B');

    const cards = page.locator('#section-experience').locator('.relative.group');
    await cards.nth(0).hover();

    const moveDownButton = cards.nth(0).locator('button[aria-label="Move down"]');
    await expect(moveDownButton).toBeVisible();
    await moveDownButton.click();

    await page.waitForTimeout(500);

    const updatedCompanyInputs = page.getByPlaceholder('Unternehmen');
    await expect(updatedCompanyInputs.nth(0)).toHaveValue('Company B');
    await expect(updatedCompanyInputs.nth(1)).toHaveValue('Company A');

    await cards.nth(1).hover();
    const moveUpButton = cards.nth(1).locator('button[aria-label="Move up"]');
    await expect(moveUpButton).toBeVisible();
    await moveUpButton.click();

    await page.waitForTimeout(500);

    const finalCompanyInputs = page.getByPlaceholder('Unternehmen');
    await expect(finalCompanyInputs.nth(0)).toHaveValue('Company A');
    await expect(finalCompanyInputs.nth(1)).toHaveValue('Company B');
  });

  test('keyboard reorders education entries with up/down buttons', async ({ page }) => {
    const addEducationButton = page.getByRole('button', { name: /Ausbildung hinzufügen/ });

    await addEducationButton.click();
    await addEducationButton.click();

    const institutionInputs = page.getByPlaceholder('Universität / Schule');
    await institutionInputs.nth(0).fill('University A');
    await institutionInputs.nth(1).fill('University B');

    await expect(institutionInputs.nth(0)).toHaveValue('University A');
    await expect(institutionInputs.nth(1)).toHaveValue('University B');

    const cards = page.locator('#section-education').locator('.relative.group');
    await cards.nth(0).hover();

    const moveDownButton = cards.nth(0).locator('button[aria-label="Move down"]');
    await expect(moveDownButton).toBeVisible();
    await moveDownButton.click();

    await page.waitForTimeout(500);

    const updatedInstitutionInputs = page.getByPlaceholder('Universität / Schule');
    await expect(updatedInstitutionInputs.nth(0)).toHaveValue('University B');
    await expect(updatedInstitutionInputs.nth(1)).toHaveValue('University A');
  });

  test('keyboard reorders skills with up/down buttons', async ({ page }) => {
    const addSkillButton = page.getByRole('button', { name: /Fähigkeit hinzufügen/ });

    await addSkillButton.click();
    await addSkillButton.click();

    const skillInputs = page.getByPlaceholder('Fähigkeit (z.B. Deutsch, Python)');
    await skillInputs.nth(0).fill('Skill A');
    await skillInputs.nth(1).fill('Skill B');

    await expect(skillInputs.nth(0)).toHaveValue('Skill A');
    await expect(skillInputs.nth(1)).toHaveValue('Skill B');

    const cards = page.locator('#section-skills').locator('.relative.group');
    await cards.nth(0).hover();

    const moveDownButton = cards.nth(0).locator('button[aria-label="Move down"]');
    await expect(moveDownButton).toBeVisible();
    await moveDownButton.click();

    await page.waitForTimeout(500);

    const updatedSkillInputs = page.getByPlaceholder('Fähigkeit (z.B. Deutsch, Python)');
    await expect(updatedSkillInputs.nth(0)).toHaveValue('Skill B');
    await expect(updatedSkillInputs.nth(1)).toHaveValue('Skill A');
  });

  test('order persists after page refresh', async ({ page }) => {
    const addExperienceButton = page.getByRole('button', { name: /Position hinzufügen/ });

    await addExperienceButton.click();
    await addExperienceButton.click();

    const companyInputs = page.getByPlaceholder('Unternehmen');
    await companyInputs.nth(0).fill('Company A');
    await companyInputs.nth(1).fill('Company B');

    const cards = page.locator('#section-experience').locator('.relative.group');
    await cards.nth(0).hover();

    const moveDownButton = cards.nth(0).locator('button[aria-label="Move down"]');
    await moveDownButton.click();

    await page.waitForTimeout(500);

    await page.reload();
    await page.waitForLoadState('networkidle');

    const reloadedCompanyInputs = page.getByPlaceholder('Unternehmen');
    await expect(reloadedCompanyInputs.nth(0)).toHaveValue('Company B');
    await expect(reloadedCompanyInputs.nth(1)).toHaveValue('Company A');
  });

  test('keyboard buttons are disabled at boundaries', async ({ page }) => {
    const addExperienceButton = page.getByRole('button', { name: /Position hinzufügen/ });
    await addExperienceButton.click();
    await addExperienceButton.click();

    const cards = page.locator('#section-experience').locator('.relative.group');

    await cards.nth(0).hover();
    const firstCardUpButton = cards.nth(0).locator('button[aria-label="Move up"]');
    await expect(firstCardUpButton).toBeDisabled();

    await cards.nth(1).hover();
    const lastCardDownButton = cards.nth(1).locator('button[aria-label="Move down"]');
    await expect(lastCardDownButton).toBeDisabled();
  });

  test('drag handles are visible on hover for all sections', async ({ page }) => {
    const addExperienceButton = page.getByRole('button', { name: /Position hinzufügen/ });
    const addEducationButton = page.getByRole('button', { name: /Ausbildung hinzufügen/ });
    const addSkillButton = page.getByRole('button', { name: /Fähigkeit hinzufügen/ });

    await addExperienceButton.click();
    await addEducationButton.click();
    await addSkillButton.click();

    const experienceCards = page.locator('#section-experience').locator('.relative.group');
    const educationCards = page.locator('#section-education').locator('.relative.group');
    const skillCards = page.locator('#section-skills').locator('.relative.group');

    await experienceCards.nth(0).hover();
    const experienceDragHandle = experienceCards.nth(0).locator('button[aria-label="Drag to reorder"]');
    await expect(experienceDragHandle).toBeVisible();

    await educationCards.nth(0).hover();
    const educationDragHandle = educationCards.nth(0).locator('button[aria-label="Drag to reorder"]');
    await expect(educationDragHandle).toBeVisible();

    await skillCards.nth(0).hover();
    const skillDragHandle = skillCards.nth(0).locator('button[aria-label="Drag to reorder"]');
    await expect(skillDragHandle).toBeVisible();
  });
});
