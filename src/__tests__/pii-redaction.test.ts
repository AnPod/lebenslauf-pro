import { describe, it, expect } from 'bun:test';
import { redactPII } from '@/lib/pii-redaction';
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
