import { CVData } from '@/types/cv';

/**
 * Exports CV data to a JSON file and triggers download
 * @param cvData - The CV data to export
 * @returns void
 */
export function exportCVToJSON(cvData: CVData): void {
  try {
    const jsonString = JSON.stringify(cvData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const timestamp = new Date().toISOString().slice(0, 10);
    const firstName = cvData.personal.firstName || 'lebenslauf';
    const lastName = cvData.personal.lastName || 'data';
    const filename = `${firstName}-${lastName}-${timestamp}.json`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export CV data:', error);
    throw new Error('Export fehlgeschlagen. Bitte versuchen Sie es erneut.');
  }
}
