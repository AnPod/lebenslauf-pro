import { describe, it, expect } from 'bun:test';
import {
  getTemplate,
  getAllTemplates,
  getAllTemplateMetadata,
  isValidTemplate,
  DEFAULT_TEMPLATE,
  templateRegistry,
} from '@/lib/templates';
import { TemplateId } from '@/types/template';

describe('templateRegistry', () => {
  it('should have all required templates', () => {
    const expectedTemplates: TemplateId[] = ['modern', 'classic', 'minimal', 'executive'];

    expectedTemplates.forEach((templateId) => {
      expect(templateRegistry[templateId]).toBeDefined();
      expect(templateRegistry[templateId].id).toBe(templateId);
    });
  });

  it('should have valid template structure for each template', () => {
    Object.values(templateRegistry).forEach((template) => {
      expect(template).toHaveProperty('id');
      expect(template).toHaveProperty('name');
      expect(template).toHaveProperty('description');
      expect(template).toHaveProperty('preview');
      expect(template).toHaveProperty('pdfComponent');
      expect(template).toHaveProperty('thumbnail');

      expect(typeof template.id).toBe('string');
      expect(typeof template.name).toBe('string');
      expect(typeof template.description).toBe('string');
      expect(typeof template.thumbnail).toBe('string');
      expect(typeof template.preview).toBe('function');
      expect(typeof template.pdfComponent).toBe('function');
    });
  });
});

describe('DEFAULT_TEMPLATE', () => {
  it('should be set to modern', () => {
    expect(DEFAULT_TEMPLATE).toBe('modern');
  });

  it('should be a valid template ID', () => {
    expect(templateRegistry[DEFAULT_TEMPLATE]).toBeDefined();
  });
});

describe('getTemplate', () => {
  it('should return the correct template for valid ID', () => {
    const template = getTemplate('modern');

    expect(template).toBeDefined();
    expect(template.id).toBe('modern');
    expect(template.name).toBe('Modern');
  });

  it('should return classic template', () => {
    const template = getTemplate('classic');

    expect(template).toBeDefined();
    expect(template.id).toBe('classic');
    expect(template.name).toBe('Classic');
  });

  it('should return minimal template', () => {
    const template = getTemplate('minimal');

    expect(template).toBeDefined();
    expect(template.id).toBe('minimal');
    expect(template.name).toBe('Minimal');
  });

  it('should return executive template', () => {
    const template = getTemplate('executive');

    expect(template).toBeDefined();
    expect(template.id).toBe('executive');
    expect(template.name).toBe('Executive');
  });

  it('should throw error for invalid template ID', () => {
    expect(() => {
      getTemplate('invalid' as TemplateId);
    }).toThrow('Template with id "invalid" not found');
  });
});

describe('getAllTemplates', () => {
  it('should return all templates', () => {
    const templates = getAllTemplates();

    expect(templates).toHaveLength(4);
    expect(templates.every((t) => t.id && t.name && t.description)).toBe(true);
  });

  it('should return templates with all required properties', () => {
    const templates = getAllTemplates();

    templates.forEach((template) => {
      expect(template).toHaveProperty('id');
      expect(template).toHaveProperty('name');
      expect(template).toHaveProperty('description');
      expect(template).toHaveProperty('preview');
      expect(template).toHaveProperty('pdfComponent');
      expect(template).toHaveProperty('thumbnail');
    });
  });

  it('should include all template IDs', () => {
    const templates = getAllTemplates();
    const templateIds = templates.map((t) => t.id);

    expect(templateIds).toContain('modern');
    expect(templateIds).toContain('classic');
    expect(templateIds).toContain('minimal');
    expect(templateIds).toContain('executive');
  });
});

describe('getAllTemplateMetadata', () => {
  it('should return metadata for all templates', () => {
    const metadata = getAllTemplateMetadata();

    expect(metadata).toHaveLength(4);
  });

  it('should return metadata without components', () => {
    const metadata = getAllTemplateMetadata();

    metadata.forEach((meta) => {
      expect(meta).toHaveProperty('id');
      expect(meta).toHaveProperty('name');
      expect(meta).toHaveProperty('description');
      expect(meta).toHaveProperty('thumbnail');

      expect(meta).not.toHaveProperty('preview');
      expect(meta).not.toHaveProperty('pdfComponent');
    });
  });

  it('should have correct metadata structure', () => {
    const metadata = getAllTemplateMetadata();

    metadata.forEach((meta) => {
      expect(typeof meta.id).toBe('string');
      expect(typeof meta.name).toBe('string');
      expect(typeof meta.description).toBe('string');
      expect(typeof meta.thumbnail).toBe('string');
    });
  });
});

describe('isValidTemplate', () => {
  it('should return true for valid template IDs', () => {
    expect(isValidTemplate('modern')).toBe(true);
    expect(isValidTemplate('classic')).toBe(true);
    expect(isValidTemplate('minimal')).toBe(true);
    expect(isValidTemplate('executive')).toBe(true);
  });

  it('should return false for invalid template IDs', () => {
    expect(isValidTemplate('invalid')).toBe(false);
    expect(isValidTemplate('')).toBe(false);
    expect(isValidTemplate('random')).toBe(false);
  });

  it('should type narrow correctly', () => {
    const id = 'modern' as string;

    if (isValidTemplate(id)) {
      expect(id).toBe('modern');
    }
  });
});
