import { describe, it, expect } from 'bun:test';
import { calculateProgress, getCompletionStatus } from '@/lib/progress';
import type { CVData } from '@/types/cv';

describe('calculateProgress', () => {
  it('should return 0% progress for empty form', () => {
    const emptyCV: CVData = {
      personal: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        postalCode: '',
        city: '',
        dateOfBirth: '',
        placeOfBirth: '',
        nationality: '',
      },
      experience: [],
      education: [],
      skills: [],
      summary: '',
    };

    const result = calculateProgress(emptyCV);

    expect(result.overall).toBe(0);
    expect(result.sections).toHaveLength(5);
    expect(result.sections[0].percentage).toBe(0);
    expect(result.sections[1].percentage).toBe(0);
    expect(result.sections[2].percentage).toBe(0);
    expect(result.sections[3].percentage).toBe(0);
    expect(result.sections[4].percentage).toBe(0);
  });

  it('should return 50% progress for half complete form', () => {
    const halfCompleteCV: CVData = {
      personal: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '',
        address: '',
        postalCode: '',
        city: '',
        dateOfBirth: '',
        placeOfBirth: '',
        nationality: '',
      },
      experience: [
        {
          id: '1',
          company: 'Tech Corp',
          position: 'Developer',
          location: '',
          startDate: '2020-01-01',
          endDate: '',
          current: true,
          description: '',
        },
      ],
      education: [],
      skills: [],
      summary: '',
    };

    const result = calculateProgress(halfCompleteCV);

    expect(result.overall).toBeGreaterThan(0);
    expect(result.overall).toBeLessThan(100);
    expect(result.sections[0].percentage).toBeGreaterThan(0);
    expect(result.sections[1].percentage).toBeGreaterThan(0);
  });

  it('should return 100% progress for fully complete form', () => {
    const completeCV: CVData = {
      personal: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        postalCode: '12345',
        city: 'New York',
        dateOfBirth: '1990-01-01',
        placeOfBirth: 'New York',
        nationality: 'US',
        photoUrl: 'https://example.com/photo.jpg',
      },
      experience: [
        {
          id: '1',
          company: 'Tech Corp',
          position: 'Developer',
          location: 'New York',
          startDate: '2020-01-01',
          endDate: '',
          current: true,
          description: 'Developed software',
        },
      ],
      education: [
        {
          id: '1',
          institution: 'University',
          degree: 'Bachelor',
          field: 'Computer Science',
          location: 'New York',
          startDate: '2015-01-01',
          endDate: '2019-01-01',
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
      summary: 'Experienced software developer with expertise in web development.',
    };

    const result = calculateProgress(completeCV);

    expect(result.overall).toBe(100);
    expect(result.sections[0].percentage).toBe(100);
    expect(result.sections[1].percentage).toBe(100);
    expect(result.sections[2].percentage).toBe(100);
    expect(result.sections[3].percentage).toBe(100);
    expect(result.sections[4].percentage).toBe(100);
  });

  it('should calculate partial sections correctly', () => {
    const partialCV: CVData = {
      personal: {
        firstName: 'John',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        postalCode: '',
        city: '',
        dateOfBirth: '',
        placeOfBirth: '',
        nationality: '',
      },
      experience: [],
      education: [],
      skills: [],
      summary: '',
    };

    const result = calculateProgress(partialCV);

    expect(result.sections[0].name).toBe('Personal');
    expect(result.sections[0].completed).toBe(1);
    expect(result.sections[0].total).toBe(11);
    expect(result.sections[0].percentage).toBe(Math.round((1 / 11) * 100));
  });

  it('should handle multiple experience entries correctly', () => {
    const cvWithMultipleExperience: CVData = {
      personal: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '',
        address: '',
        postalCode: '',
        city: '',
        dateOfBirth: '',
        placeOfBirth: '',
        nationality: '',
      },
      experience: [
        {
          id: '1',
          company: 'Tech Corp',
          position: 'Developer',
          location: '',
          startDate: '2020-01-01',
          endDate: '',
          current: true,
          description: '',
        },
        {
          id: '2',
          company: 'Another Corp',
          position: 'Senior Developer',
          location: '',
          startDate: '2018-01-01',
          endDate: '2020-01-01',
          current: false,
          description: '',
        },
      ],
      education: [],
      skills: [],
      summary: '',
    };

    const result = calculateProgress(cvWithMultipleExperience);

    expect(result.sections[1].name).toBe('Experience');
    expect(result.sections[1].total).toBe(3);
    expect(result.sections[1].completed).toBe(3);
    expect(result.sections[1].percentage).toBe(100);
  });

  it('should handle summary with minimum length', () => {
    const cvWithShortSummary: CVData = {
      personal: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '',
        address: '',
        postalCode: '',
        city: '',
        dateOfBirth: '',
        placeOfBirth: '',
        nationality: '',
      },
      experience: [],
      education: [],
      skills: [],
      summary: 'Short',
    };

    const result = calculateProgress(cvWithShortSummary);

    expect(result.sections[4].name).toBe('Summary');
    expect(result.sections[4].percentage).toBe(0);
  });

  it('should handle summary with sufficient length', () => {
    const cvWithLongSummary: CVData = {
      personal: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '',
        address: '',
        postalCode: '',
        city: '',
        dateOfBirth: '',
        placeOfBirth: '',
        nationality: '',
      },
      experience: [],
      education: [],
      skills: [],
      summary: 'This is a sufficiently long summary that meets the minimum length requirement of 50 characters.',
    };

    const result = calculateProgress(cvWithLongSummary);

    expect(result.sections[4].name).toBe('Summary');
    expect(result.sections[4].percentage).toBe(100);
  });
});

describe('getCompletionStatus', () => {
  it('should return "Not started" for 0%', () => {
    expect(getCompletionStatus(0)).toBe('Not started');
  });

  it('should return "Just started" for less than 25%', () => {
    expect(getCompletionStatus(10)).toBe('Just started');
    expect(getCompletionStatus(24)).toBe('Just started');
  });

  it('should return "In progress" for 25% to less than 50%', () => {
    expect(getCompletionStatus(25)).toBe('In progress');
    expect(getCompletionStatus(35)).toBe('In progress');
    expect(getCompletionStatus(49)).toBe('In progress');
  });

  it('should return "Almost there" for 50% to less than 75%', () => {
    expect(getCompletionStatus(50)).toBe('Almost there');
    expect(getCompletionStatus(60)).toBe('Almost there');
    expect(getCompletionStatus(74)).toBe('Almost there');
  });

  it('should return "Nearly complete" for 75% to less than 100%', () => {
    expect(getCompletionStatus(75)).toBe('Nearly complete');
    expect(getCompletionStatus(85)).toBe('Nearly complete');
    expect(getCompletionStatus(99)).toBe('Nearly complete');
  });

  it('should return "Complete" for 100%', () => {
    expect(getCompletionStatus(100)).toBe('Complete');
  });
});
