import { test, expect } from '@playwright/test';
import { CVData } from '../src/types/cv';

const sampleCVData: CVData = {
  personal: {
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max.mustermann@example.com',
    phone: '+49 123 456789',
    address: 'Musterstraße 1',
    postalCode: '12345',
    city: 'Berlin',
    dateOfBirth: '1990-01-01',
    placeOfBirth: 'München',
    nationality: 'Deutsch',
  },
  experience: [
    {
      id: '1',
      company: 'Tech Company GmbH',
      position: 'Senior Developer',
      location: 'Berlin',
      startDate: '2020-01-01',
      endDate: '2023-12-31',
      current: false,
      description: 'Developed web applications',
    },
  ],
  education: [
    {
      id: '1',
      institution: 'Technische Universität Berlin',
      degree: 'Master',
      field: 'Informatik',
      location: 'Berlin',
      startDate: '2015-01-01',
      endDate: '2019-12-31',
      current: false,
    },
  ],
  skills: [
    {
      id: '1',
      name: 'TypeScript',
      level: 'Sehr gut',
      category: 'technical',
    },
    {
      id: '2',
      name: 'Englisch',
      level: 'C1',
      category: 'language',
    },
  ],
  summary: 'Erfahrener Softwareentwickler mit Fokus auf Webentwicklung.',
};

test.describe('JSON Export and Import', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should export CV data as JSON file', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');

    await page.click('button:has-text("Export")', { force: true });

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/-.*\.json$/);

    const path = await download.path();
    const fs = require('fs');
    const content = fs.readFileSync(path, 'utf-8');
    const exportedData = JSON.parse(content);

    expect(exportedData).toHaveProperty('personal');
    expect(exportedData).toHaveProperty('experience');
    expect(exportedData).toHaveProperty('education');
    expect(exportedData).toHaveProperty('skills');
    expect(exportedData).toHaveProperty('summary');
  });

  test('should import valid JSON file and restore data', async ({ page }) => {
    const fileBuffer = Buffer.from(JSON.stringify(sampleCVData, null, 2));

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('button:has-text("Import")', { force: true });
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test-cv.json',
      mimeType: 'application/json',
      buffer: fileBuffer,
    });

    await expect(page.getByText('CV erfolgreich importiert!')).toBeVisible();

    await page.waitForTimeout(1000);

    const localStorageData = await page.evaluate(() => {
      const data = localStorage.getItem('lebenslauf-data');
      return data ? JSON.parse(data) : null;
    });

    expect(localStorageData).not.toBeNull();
    expect(localStorageData.personal.firstName).toBe('Max');
    expect(localStorageData.personal.lastName).toBe('Mustermann');
    expect(localStorageData.experience).toHaveLength(1);
    expect(localStorageData.education).toHaveLength(1);
    expect(localStorageData.skills).toHaveLength(2);
  });

  test('should show error for invalid JSON file', async ({ page }) => {
    const invalidJson = '{ invalid json }';
    const fileBuffer = Buffer.from(invalidJson);

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('button:has-text("Import")', { force: true });
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'invalid.json',
      mimeType: 'application/json',
      buffer: fileBuffer,
    });

    await expect(page.getByText(/Ungültiges JSON-Format/)).toBeVisible();
  });

  test('should show error for JSON with invalid data structure', async ({ page }) => {
    const invalidData = {
      personal: {
        firstName: 'Max',
      },
      experience: 'not an array',
    };
    const fileBuffer = Buffer.from(JSON.stringify(invalidData));

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('button:has-text("Import")', { force: true });
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'invalid-structure.json',
      mimeType: 'application/json',
      buffer: fileBuffer,
    });

    await expect(page.getByText(/Validierungsfehler/)).toBeVisible();
  });

  test('should show error for non-JSON file', async ({ page }) => {
    const fileBuffer = Buffer.from('This is a text file');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('button:has-text("Import")', { force: true });
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: fileBuffer,
    });

    await expect(page.getByText(/Bitte wählen Sie eine JSON-Datei aus/)).toBeVisible();
  });
});
