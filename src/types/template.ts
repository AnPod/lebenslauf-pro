import { CVData } from './cv';
import { ReactNode } from 'react';

/**
 * Template ID type - union of all available template IDs
 * Add new template IDs here when creating new templates
 */
export type TemplateId = 'modern' | 'classic' | 'minimal' | 'executive';

/**
 * Template interface defining the structure of a CV template
 *
 * @template-creation-guidelines:
 * 1. Each template must have a unique id matching TemplateId union
 * 2. Provide a descriptive name and short description
 * 3. Create a preview component for UI display (React component)
 * 4. Create a PDF component for PDF generation (React component compatible with @react-pdf/renderer)
 * 5. Add thumbnail URL for template selection UI
 *
 * @example
 * ```typescript
 * const modernTemplate: Template = {
 *   id: 'modern',
 *   name: 'Modern',
 *   description: 'Clean design with colorful accents',
 *   preview: ModernPreview,
 *   pdfComponent: ModernPDF,
 *   thumbnail: '/templates/modern-thumb.png'
 * };
 * ```
 */
export interface Template {
  /** Unique identifier for the template */
  id: TemplateId;

  /** Display name shown in template selector */
  name: string;

  /** Short description of the template style */
  description: string;

  /** React component for live preview in the UI */
  preview: React.ComponentType<{ data: CVData }>;

  /** React component for PDF generation (compatible with @react-pdf/renderer) */
  pdfComponent: React.ComponentType<{ data: CVData }>;

  /** Thumbnail image URL for template selection UI */
  thumbnail: string;
}

/**
 * Template registry type - maps template IDs to Template objects
 * This is the central registry for all available templates
 */
export type TemplateRegistry = Record<TemplateId, Template>;

/**
 * Template metadata for display purposes
 * Used in template selector UI
 */
export interface TemplateMetadata {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string;
}
