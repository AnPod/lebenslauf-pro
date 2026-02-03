import { pdf } from '@react-pdf/renderer';
import { CVData } from '@/types/cv';
import { PDFDocument } from '@/components/PDFDocument';

/**
 * Format date to German format (MM.YYYY)
 */
export function formatDateGerman(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('de-DE', {
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Generate PDF blob from CV data
 */
export async function generatePDFBlob(data: CVData): Promise<Blob> {
  const doc = <PDFDocument data={data} />;
  const blob = await pdf(doc).toBlob();
  return blob;
}

/**
 * Generate PDF as base64 string from CV data
 */
export async function generatePDFBase64(data: CVData): Promise<string> {
  const doc = <PDFDocument data={data} />;
  const base64 = pdf(doc).toString();
  return base64;
}

/**
 * Download PDF file from CV data
 */
export async function downloadPDF(data: CVData, filename?: string): Promise<void> {
  const blob = await generatePDFBlob(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  // Generate filename from personal info
  const defaultFilename = `${data.personal.firstName}_${data.personal.lastName}_Lebenslauf.pdf`;
  link.download = filename || defaultFilename;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate PDF and return as data URL
 */
export async function generatePDFDataURL(data: CVData): Promise<string> {
  const blob = await generatePDFBlob(data);
  return URL.createObjectURL(blob);
}
