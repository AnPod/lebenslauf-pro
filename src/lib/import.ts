import { CVData } from '@/types/cv';
import { validateCVData } from '@/lib/validation';

export interface ImportResult {
  success: boolean;
  data?: CVData;
  error?: string;
}

/**
 * Imports CV data from a JSON file
 * @param file - The JSON file to import
 * @returns Promise with import result containing data or error
 */
export async function importCVFromJSON(file: File): Promise<ImportResult> {
  try {
    if (!file.type.includes('json') && !file.name.endsWith('.json')) {
      return {
        success: false,
        error: 'Bitte wählen Sie eine JSON-Datei aus.',
      };
    }

    const text = await file.text();

    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      return {
        success: false,
        error: 'Ungültiges JSON-Format. Die Datei konnte nicht gelesen werden.',
      };
    }

    const validationResult = validateCVData(parsedData);

    if (!validationResult.success) {
      const errorMessages = validationResult.errors
        ?.map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');

      return {
        success: false,
        error: `Validierungsfehler:\n${errorMessages}`,
      };
    }

    return {
      success: true,
      data: validationResult.data as CVData,
    };
  } catch (error) {
    console.error('Failed to import CV data:', error);
    return {
      success: false,
      error: 'Import fehlgeschlagen. Bitte versuchen Sie es erneut.',
    };
  }
}
