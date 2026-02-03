import { Template, TemplateId, TemplateRegistry, TemplateMetadata } from '@/types/template';
import { ModernPreview, ModernPDF } from '@/components/templates/Modern';
import { ClassicPreview, ClassicPDF } from '@/components/templates/Classic';
import { ExecutivePreview, ExecutivePDF } from '@/components/templates/Executive';
import { MinimalPreview, MinimalPDF } from '@/components/templates/Minimal';
import { PlaceholderPreview, PlaceholderPDF } from '@/components/templates/Placeholder';

/**
 * Template Registry - central registry of all available templates
 *
 * To add a new template:
 * 1. Add the template ID to the TemplateId union in src/types/template.ts
 * 2. Create the preview and PDF components
 * 3. Add the template to this registry
 * 4. Add a thumbnail image to public/templates/
 */
export const templateRegistry: TemplateRegistry = {
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean design with colorful accents and modern typography',
    preview: ModernPreview,
    pdfComponent: ModernPDF,
    thumbnail: '/templates/modern-thumb.png',
  },

  classic: {
    id: 'classic',
    description: 'Traditional design with serif fonts and elegant layout',
    name: 'Classic',
    preview: ClassicPreview,
    pdfComponent: ClassicPDF,
    thumbnail: '/templates/classic-thumb.png',
  },

  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean design with generous whitespace',
    preview: MinimalPreview,
    pdfComponent: MinimalPDF,
    thumbnail: '/templates/minimal-thumb.png',
  },

  executive: {
    id: 'executive',
    name: 'Executive',
    description: 'Bold and authoritative design for senior professionals',
    preview: ExecutivePreview,
    pdfComponent: ExecutivePDF,
    thumbnail: '/templates/executive-thumb.png',
  },
};

/**
 * Default template ID - used when no template is selected
 */
export const DEFAULT_TEMPLATE: TemplateId = 'modern';

/**
 * Get a template by ID
 *
 * @param id - The template ID to retrieve
 * @returns The template object, or throws an error if not found
 *
 * @example
 * ```typescript
 * const template = getTemplate('modern');
 * console.log(template.name); // 'Modern'
 * ```
 */
export function getTemplate(id: TemplateId): Template {
  const template = templateRegistry[id];
  if (!template) {
    throw new Error(`Template with id "${id}" not found`);
  }
  return template;
}

/**
 * Get all available templates
 *
 * @returns Array of all registered templates
 *
 * @example
 * ```typescript
 * const templates = getAllTemplates();
 * templates.forEach(t => console.log(t.name));
 * ```
 */
export function getAllTemplates(): Template[] {
  return Object.values(templateRegistry);
}

/**
 * Get template metadata for all templates (lightweight version without components)
 *
 * @returns Array of template metadata objects
 *
 * @example
 * ```typescript
 * const metadata = getAllTemplateMetadata();
 * metadata.forEach(m => console.log(m.name, m.description));
 * ```
 */
export function getAllTemplateMetadata(): TemplateMetadata[] {
  return getAllTemplates().map((template) => ({
    id: template.id,
    name: template.name,
    description: template.description,
    thumbnail: template.thumbnail,
  }));
}

/**
 * Check if a template ID is valid
 *
 * @param id - The template ID to validate
 * @returns true if the template exists, false otherwise
 *
 * @example
 * ```typescript
 * if (isValidTemplate('modern')) {
 *   // Use the template
 * }
 * ```
 */
export function isValidTemplate(id: string): id is TemplateId {
  return id in templateRegistry;
}
