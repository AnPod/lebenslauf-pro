import { describe, it, expect } from 'bun:test';
import { redactPII, redactTextPII } from '@/lib/pii-redaction';
import { CVData } from '@/types/cv';

const mockCVData: CVData = {
  personal: {
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.com',
    phone: '+49 123 456789',
    address: 'Musterstraße 1',
    postalCode: '12345',
    city: 'Berlin',
    dateOfBirth: '1990-01-01',
    placeOfBirth: 'München',
    nationality: 'Deutsch',
  },
  summary: 'Erfahrener Softwareentwickler',
  experience: [
    {
      id: '1',
      company: 'Tech GmbH',
      position: 'Senior Developer',
      location: 'Berlin',
      startDate: '2020-01',
      endDate: '',
      current: true,
      description: 'Entwicklung von Webanwendungen',
    },
  ],
  education: [
    {
      id: '1',
      institution: 'TU Berlin',
      degree: 'Bachelor',
      field: 'Informatik',
      location: 'Berlin',
      startDate: '2010-10',
      endDate: '2014-09',
      current: false,
    },
  ],
  skills: [
    {
      id: '1',
      name: 'JavaScript',
      level: 'Sehr gut',
      category: 'technical',
    },
  ],
};

describe('PII Redaction', () => {
  it('should redact first name', () => {
    const result = redactPII(mockCVData);
    expect(result.personal.firstName).toBe('[VORNAME]');
  });

  it('should redact last name', () => {
    const result = redactPII(mockCVData);
    expect(result.personal.lastName).toBe('[NACHNAME]');
  });

  it('should redact email', () => {
    const result = redactPII(mockCVData);
    expect(result.personal.email).toBe('[EMAIL]');
  });

  it('should redact phone number', () => {
    const result = redactPII(mockCVData);
    expect(result.personal.phone).toBe('[TELEFON]');
  });

  it('should redact address', () => {
    const result = redactPII(mockCVData);
    expect(result.personal.address).toBe('[ADRESSE]');
  });

  it('should redact city', () => {
    const result = redactPII(mockCVData);
    expect(result.personal.city).toBe('[STADT]');
  });

  it('should redact date of birth', () => {
    const result = redactPII(mockCVData);
    expect(result.personal.dateOfBirth).toBe('[GEBURTSDATUM]');
  });

  it('should redact place of birth', () => {
    const result = redactPII(mockCVData);
    expect(result.personal.placeOfBirth).toBe('[GEBURTSORT]');
  });

  it('should preserve nationality', () => {
    const result = redactPII(mockCVData);
    expect(result.personal.nationality).toBe('Deutsch');
  });

  it('should preserve summary', () => {
    const result = redactPII(mockCVData);
    expect(result.summary).toBe('Erfahrener Softwareentwickler');
  });

  it('should preserve experience data', () => {
    const result = redactPII(mockCVData);
    expect(result.experience[0].company).toBe('Tech GmbH');
    expect(result.experience[0].position).toBe('Senior Developer');
  });

  it('should preserve education data', () => {
    const result = redactPII(mockCVData);
    expect(result.education[0].institution).toBe('TU Berlin');
    expect(result.education[0].degree).toBe('Bachelor');
  });

  it('should preserve skills', () => {
    const result = redactPII(mockCVData);
    expect(result.skills[0].name).toBe('JavaScript');
  });
});

describe('redactTextPII', () => {
  describe('email redaction', () => {
    it('should redact email addresses', () => {
      const text = 'Contact me at john.doe@example.com for more info';
      const result = redactTextPII(text);
      expect(result).toContain('[EMAIL]');
      expect(result).not.toContain('john.doe@example.com');
    });

    it('should redact multiple email addresses', () => {
      const text = 'Email john@example.com or jane@test.org';
      const result = redactTextPII(text);
      expect(result).toContain('[EMAIL]');
      expect(result).not.toContain('john@example.com');
      expect(result).not.toContain('jane@test.org');
    });

    it('should redact emails with special characters', () => {
      const text = 'Contact user+tag@domain.co.uk';
      const result = redactTextPII(text);
      expect(result).toContain('[EMAIL]');
      expect(result).not.toContain('user+tag@domain.co.uk');
    });
  });

  describe('phone number redaction', () => {
    it('should redact international phone numbers', () => {
      const text = 'Call me at +49 123 4567890';
      const result = redactTextPII(text);
      expect(result).toContain('[TELEFON]');
      expect(result).not.toContain('+49 123 4567890');
    });

    it('should redact German phone numbers', () => {
      const text = 'Reach me at 0123 4567890';
      const result = redactTextPII(text);
      expect(result).toContain('[TELEFON]');
      expect(result).not.toContain('0123 4567890');
    });

    it('should redact German phone numbers with slash', () => {
      const text = 'Phone: 0123/4567890';
      const result = redactTextPII(text);
      expect(result).toContain('[TELEFON]');
      expect(result).not.toContain('0123/4567890');
    });

    it('should redact US phone numbers', () => {
      const text = 'Call (123) 456-7890';
      const result = redactTextPII(text);
      expect(result).toContain('[TELEFON]');
      expect(result).not.toContain('(123) 456-7890');
    });

    it('should redact US phone numbers with spaces', () => {
      const text = 'Phone: (123) 456 7890';
      const result = redactTextPII(text);
      expect(result).toContain('[TELEFON]');
      expect(result).not.toContain('(123) 456 7890');
    });
  });

  describe('address redaction', () => {
    it('should redact German street addresses', () => {
      const text = 'I live at Musterstraße 123';
      const result = redactTextPII(text);
      expect(result).toContain('[ADRESSE]');
      expect(result).not.toContain('Musterstraße 123');
    });

    it('should redact German street with abbreviation', () => {
      const text = 'Address: Hauptstr. 45';
      const result = redactTextPII(text);
      expect(result).toContain('[ADRESSE]');
      expect(result).not.toContain('Hauptstr. 45');
    });

    it('should redact German addresses with different street types', () => {
      const text = 'Living at Berliner Weg 10 or Musterplatz 5';
      const result = redactTextPII(text);
      expect(result).toContain('[ADRESSE]');
      expect(result).not.toContain('Berliner Weg 10');
      expect(result).not.toContain('Musterplatz 5');
    });

    it('should redact international street addresses', () => {
      const text = '123 Main Street, New York';
      const result = redactTextPII(text);
      expect(result).toContain('[ADRESSE]');
      expect(result).not.toContain('123 Main Street');
    });

    it('should redact addresses with abbreviations', () => {
      const text = '45 Park Ave, Boston';
      const result = redactTextPII(text);
      expect(result).toContain('[ADRESSE]');
      expect(result).not.toContain('45 Park Ave');
    });
  });

  describe('name redaction', () => {
    it('should redact names in text', () => {
      const text = 'Please contact John for details';
      const result = redactTextPII(text);
      expect(result).toContain('[NAME]');
      expect(result).not.toContain('John');
    });

    it('should not redact common German words', () => {
      const text = 'Der Mann und die Frau gehen';
      const result = redactTextPII(text);
      expect(result).toContain('Der');
      expect(result).toContain('Mann');
      expect(result).toContain('und');
      expect(result).toContain('die');
      expect(result).toContain('Frau');
      expect(result).not.toContain('[NAME]');
    });

    it('should not redact common English words', () => {
      const text = 'The quick brown fox';
      const result = redactTextPII(text);
      expect(result).toContain('The');
      expect(result).toContain('quick');
      expect(result).toContain('brown');
      expect(result).toContain('fox');
      expect(result).not.toContain('[NAME]');
    });

    it('should not redact company names', () => {
      const text = 'Working at Tech GmbH and Software AG';
      const result = redactTextPII(text);
      expect(result).toContain('Tech');
      expect(result).toContain('GmbH');
      expect(result).toContain('Software');
      expect(result).toContain('AG');
      expect(result).not.toContain('[NAME]');
    });

    it('should not redact city names', () => {
      const text = 'Living in Berlin and Munich';
      const result = redactTextPII(text);
      expect(result).toContain('Berlin');
      expect(result).toContain('Munich');
      expect(result).not.toContain('[NAME]');
    });

    it('should not redact first word of sentence', () => {
      const text = 'John is a developer';
      const result = redactTextPII(text);
      expect(result).toContain('John');
      expect(result).not.toContain('[NAME]');
    });

    it('should not redact words followed by street types', () => {
      const text = 'Main Street is long';
      const result = redactTextPII(text);
      expect(result).toContain('Main');
      expect(result).not.toContain('[NAME]');
    });
  });

  describe('context preservation', () => {
    it('should preserve overall text structure', () => {
      const text = 'Contact John at john@example.com or call +49 123 4567890';
      const result = redactTextPII(text);
      expect(result).toContain('Contact');
      expect(result).toContain('at');
      expect(result).toContain('or');
      expect(result).toContain('call');
      expect(result).toContain('[NAME]');
      expect(result).toContain('[EMAIL]');
      expect(result).toContain('[TELEFON]');
    });

    it('should handle text with no PII', () => {
      const text = 'This is a simple text with no personal information';
      const result = redactTextPII(text);
      expect(result).toBe(text);
    });

    it('should handle empty string', () => {
      const text = '';
      const result = redactTextPII(text);
      expect(result).toBe('');
    });

    it('should handle mixed PII types', () => {
      const text = 'Email Jane at jane@test.com, call her at 0123/4567890, or visit at Musterstraße 10';
      const result = redactTextPII(text);
      expect(result).toContain('[NAME]');
      expect(result).toContain('[EMAIL]');
      expect(result).toContain('[TELEFON]');
      expect(result).toContain('[ADRESSE]');
      expect(result).not.toContain('Jane');
      expect(result).not.toContain('jane@test.com');
      expect(result).not.toContain('0123/4567890');
      expect(result).not.toContain('Musterstraße 10');
    });
  });
});
