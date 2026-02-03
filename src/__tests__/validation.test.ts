import { describe, it, expect } from 'bun:test';
import {
  personalInfoSchema,
  experienceSchema,
  educationSchema,
  skillSchema,
  cvDataSchema,
  validateCVData,
  validatePersonalInfo,
  validateExperience,
  validateEducation,
  validateSkill,
} from '@/lib/validation';

describe('personalInfoSchema', () => {
  it('should validate valid personal info', () => {
    const validData = {
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
    };

    const result = personalInfoSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate personal info with only required fields', () => {
    const minimalData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };

    const result = personalInfoSchema.safeParse(minimalData);
    expect(result.success).toBe(true);
  });

  it('should reject empty firstName', () => {
    const invalidData = {
      firstName: '',
      lastName: 'Doe',
      email: 'john@example.com',
    };

    const result = personalInfoSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const firstNameError = result.error.issues.find((issue) => issue.path[0] === 'firstName');
      expect(firstNameError?.message).toBe('Dieses Feld ist erforderlich');
    }
  });

  it('should reject firstName with less than 2 characters', () => {
    const invalidData = {
      firstName: 'J',
      lastName: 'Doe',
      email: 'john@example.com',
    };

    const result = personalInfoSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const firstNameError = result.error.issues.find((issue) => issue.path[0] === 'firstName');
      expect(firstNameError?.message).toBe('Mindestens 2 Zeichen erforderlich');
    }
  });

  it('should reject invalid email format', () => {
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
    };

    const result = personalInfoSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find((issue) => issue.path[0] === 'email');
      expect(emailError?.message).toBe('Bitte geben Sie eine gültige E-Mail-Adresse ein');
    }
  });

  it('should reject invalid date format', () => {
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      dateOfBirth: '01-01-1990',
    };

    const result = personalInfoSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const dateError = result.error.issues.find((issue) => issue.path[0] === 'dateOfBirth');
      expect(dateError?.message).toBe('Ungültiges Datum');
    }
  });

  it('should reject invalid date value', () => {
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      dateOfBirth: '1990-13-01',
    };

    const result = personalInfoSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const dateError = result.error.issues.find((issue) => issue.path[0] === 'dateOfBirth');
      expect(dateError?.message).toBe('Ungültiges Datum');
    }
  });

  it('should accept empty string for photoUrl', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      photoUrl: '',
    };

    const result = personalInfoSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

describe('experienceSchema', () => {
  it('should validate valid experience with current position', () => {
    const validData = {
      id: '1',
      company: 'Tech Corp',
      position: 'Developer',
      location: 'New York',
      startDate: '2020-01-01',
      endDate: '',
      current: true,
      description: 'Developed software',
    };

    const result = experienceSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate valid experience with end date', () => {
    const validData = {
      id: '1',
      company: 'Tech Corp',
      position: 'Developer',
      location: 'New York',
      startDate: '2020-01-01',
      endDate: '2022-01-01',
      current: false,
      description: 'Developed software',
    };

    const result = experienceSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject empty company', () => {
    const invalidData = {
      company: '',
      position: 'Developer',
      startDate: '2020-01-01',
      current: true,
    };

    const result = experienceSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const companyError = result.error.issues.find((issue) => issue.path[0] === 'company');
      expect(companyError?.message).toBe('Dieses Feld ist erforderlich');
    }
  });

  it('should reject company with less than 2 characters', () => {
    const invalidData = {
      company: 'T',
      position: 'Developer',
      startDate: '2020-01-01',
      current: true,
    };

    const result = experienceSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const companyError = result.error.issues.find((issue) => issue.path[0] === 'company');
      expect(companyError?.message).toBe('Mindestens 2 Zeichen erforderlich');
    }
  });

  it('should reject empty position', () => {
    const invalidData = {
      company: 'Tech Corp',
      position: '',
      startDate: '2020-01-01',
      current: true,
    };

    const result = experienceSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const positionError = result.error.issues.find((issue) => issue.path[0] === 'position');
      expect(positionError?.message).toBe('Dieses Feld ist erforderlich');
    }
  });

  it('should reject empty startDate', () => {
    const invalidData = {
      company: 'Tech Corp',
      position: 'Developer',
      startDate: '',
      current: true,
    };

    const result = experienceSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const startDateError = result.error.issues.find((issue) => issue.path[0] === 'startDate');
      expect(startDateError?.message).toBe('Dieses Feld ist erforderlich');
    }
  });

  it('should reject invalid startDate format', () => {
    const invalidData = {
      company: 'Tech Corp',
      position: 'Developer',
      startDate: '01-01-2020',
      current: true,
    };

    const result = experienceSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const startDateError = result.error.issues.find((issue) => issue.path[0] === 'startDate');
      expect(startDateError?.message).toBe('Ungültiges Datum');
    }
  });

  it('should reject missing endDate when not current', () => {
    const invalidData = {
      company: 'Tech Corp',
      position: 'Developer',
      startDate: '2020-01-01',
      current: false,
    };

    const result = experienceSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const endDateError = result.error.issues.find((issue) => issue.path[0] === 'endDate');
      expect(endDateError?.message).toBe('Enddatum ist erforderlich, wenn nicht aktuell');
    }
  });

  it('should reject invalid endDate format when not current', () => {
    const invalidData = {
      company: 'Tech Corp',
      position: 'Developer',
      startDate: '2020-01-01',
      endDate: '01-01-2022',
      current: false,
    };

    const result = experienceSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const endDateError = result.error.issues.find((issue) => issue.path[0] === 'endDate');
      expect(endDateError?.message).toBe('Ungültiges Datum');
    }
  });
});

describe('educationSchema', () => {
  it('should validate valid education with current study', () => {
    const validData = {
      id: '1',
      institution: 'University',
      degree: 'Bachelor',
      field: 'Computer Science',
      location: 'New York',
      startDate: '2015-01-01',
      endDate: '',
      current: true,
    };

    const result = educationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate valid education with end date', () => {
    const validData = {
      id: '1',
      institution: 'University',
      degree: 'Bachelor',
      field: 'Computer Science',
      location: 'New York',
      startDate: '2015-01-01',
      endDate: '2019-01-01',
      current: false,
    };

    const result = educationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject empty institution', () => {
    const invalidData = {
      institution: '',
      degree: 'Bachelor',
      startDate: '2015-01-01',
      current: true,
    };

    const result = educationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const institutionError = result.error.issues.find((issue) => issue.path[0] === 'institution');
      expect(institutionError?.message).toBe('Dieses Feld ist erforderlich');
    }
  });

  it('should reject institution with less than 2 characters', () => {
    const invalidData = {
      institution: 'U',
      degree: 'Bachelor',
      startDate: '2015-01-01',
      current: true,
    };

    const result = educationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const institutionError = result.error.issues.find((issue) => issue.path[0] === 'institution');
      expect(institutionError?.message).toBe('Mindestens 2 Zeichen erforderlich');
    }
  });

  it('should reject empty degree', () => {
    const invalidData = {
      institution: 'University',
      degree: '',
      startDate: '2015-01-01',
      current: true,
    };

    const result = educationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const degreeError = result.error.issues.find((issue) => issue.path[0] === 'degree');
      expect(degreeError?.message).toBe('Dieses Feld ist erforderlich');
    }
  });

  it('should reject missing endDate when not current', () => {
    const invalidData = {
      institution: 'University',
      degree: 'Bachelor',
      startDate: '2015-01-01',
      current: false,
    };

    const result = educationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const endDateError = result.error.issues.find((issue) => issue.path[0] === 'endDate');
      expect(endDateError?.message).toBe('Enddatum ist erforderlich, wenn nicht aktuell');
    }
  });
});

describe('skillSchema', () => {
  it('should validate valid language skill', () => {
    const validData = {
      id: '1',
      name: 'German',
      level: 'C2',
      category: 'language' as const,
    };

    const result = skillSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate valid technical skill', () => {
    const validData = {
      id: '1',
      name: 'JavaScript',
      level: 'Sehr gut',
      category: 'technical' as const,
    };

    const result = skillSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate valid soft skill', () => {
    const validData = {
      id: '1',
      name: 'Communication',
      level: 'Gut',
      category: 'soft' as const,
    };

    const result = skillSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject empty name', () => {
    const invalidData = {
      name: '',
      level: 'C2',
      category: 'language' as const,
    };

    const result = skillSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.issues.find((issue) => issue.path[0] === 'name');
      expect(nameError?.message).toBe('Dieses Feld ist erforderlich');
    }
  });

  it('should reject name with less than 2 characters', () => {
    const invalidData = {
      name: 'J',
      level: 'C2',
      category: 'language' as const,
    };

    const result = skillSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.issues.find((issue) => issue.path[0] === 'name');
      expect(nameError?.message).toBe('Mindestens 2 Zeichen erforderlich');
    }
  });

  it('should reject invalid skill level', () => {
    const invalidData = {
      name: 'German',
      level: 'Expert',
      category: 'language' as const,
    };

    const result = skillSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid skill category', () => {
    const invalidData = {
      name: 'German',
      level: 'C2',
      category: 'other' as const,
    };

    const result = skillSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('cvDataSchema', () => {
  it('should validate complete CV data', () => {
    const validData = {
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
      },
      experience: [
        {
          id: '1',
          company: 'Tech Corp',
          position: 'Developer',
          startDate: '2020-01-01',
          current: true,
        },
      ],
      education: [
        {
          id: '1',
          institution: 'University',
          degree: 'Bachelor',
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
          category: 'technical' as const,
        },
      ],
      summary: 'Experienced software developer',
    };

    const result = cvDataSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate CV data with empty arrays', () => {
    const validData = {
      personal: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
      experience: [],
      education: [],
      skills: [],
      summary: '',
    };

    const result = cvDataSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid personal info', () => {
    const invalidData = {
      personal: {
        firstName: 'J',
        lastName: 'Doe',
        email: 'john@example.com',
      },
      experience: [],
      education: [],
      skills: [],
    };

    const result = cvDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid experience in array', () => {
    const invalidData = {
      personal: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
      experience: [
        {
          company: 'T',
          position: 'Developer',
          startDate: '2020-01-01',
          current: true,
        },
      ],
      education: [],
      skills: [],
    };

    const result = cvDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('validateCVData', () => {
  it('should return success for valid data', () => {
    const validData = {
      personal: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
      experience: [],
      education: [],
      skills: [],
    };

    const result = validateCVData(validData);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.errors).toBeUndefined();
  });

  it('should return errors for invalid data', () => {
    const invalidData = {
      personal: {
        firstName: 'J',
        lastName: 'Doe',
        email: 'invalid-email',
      },
      experience: [],
      education: [],
      skills: [],
    };

    const result = validateCVData(invalidData);
    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(0);
  });

  it('should format errors with path and message', () => {
    const invalidData = {
      personal: {
        firstName: 'J',
        lastName: 'Doe',
        email: 'invalid-email',
      },
      experience: [],
      education: [],
      skills: [],
    };

    const result = validateCVData(invalidData);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();

    const firstNameError = result.errors!.find((error) =>
      error.path.includes('firstName')
    );
    expect(firstNameError).toBeDefined();
    expect(firstNameError?.message).toBe('Mindestens 2 Zeichen erforderlich');

    const emailError = result.errors!.find((error) =>
      error.path.includes('email')
    );
    expect(emailError).toBeDefined();
    expect(emailError?.message).toBe('Bitte geben Sie eine gültige E-Mail-Adresse ein');
  });
});

describe('validatePersonalInfo', () => {
  it('should return success for valid personal info', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };

    const result = validatePersonalInfo(validData);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should return errors for invalid personal info', () => {
    const invalidData = {
      firstName: '',
      lastName: 'Doe',
      email: 'invalid',
    };

    const result = validatePersonalInfo(invalidData);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(0);
  });
});

describe('validateExperience', () => {
  it('should return success for valid experience', () => {
    const validData = {
      company: 'Tech Corp',
      position: 'Developer',
      startDate: '2020-01-01',
      current: true,
    };

    const result = validateExperience(validData);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should return errors for invalid experience', () => {
    const invalidData = {
      company: '',
      position: 'Developer',
      startDate: '2020-01-01',
      current: true,
    };

    const result = validateExperience(invalidData);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });
});

describe('validateEducation', () => {
  it('should return success for valid education', () => {
    const validData = {
      institution: 'University',
      degree: 'Bachelor',
      startDate: '2015-01-01',
      current: true,
    };

    const result = validateEducation(validData);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should return errors for invalid education', () => {
    const invalidData = {
      institution: '',
      degree: 'Bachelor',
      startDate: '2015-01-01',
      current: true,
    };

    const result = validateEducation(invalidData);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });
});

describe('validateSkill', () => {
  it('should return success for valid skill', () => {
    const validData = {
      name: 'JavaScript',
      level: 'Sehr gut',
      category: 'technical' as const,
    };

    const result = validateSkill(validData);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should return errors for invalid skill', () => {
    const invalidData = {
      name: '',
      level: 'Sehr gut',
      category: 'technical' as const,
    };

    const result = validateSkill(invalidData);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });
});
