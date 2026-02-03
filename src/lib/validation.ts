import { z } from 'zod';

const errorMessages = {
  required: 'Dieses Feld ist erforderlich',
  invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
  minTwoChars: 'Mindestens 2 Zeichen erforderlich',
  invalidDate: 'Ungültiges Datum',
} as const;

const dateSchema = z.string()
  .min(1, { message: errorMessages.required })
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: errorMessages.invalidDate })
  .refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }, { message: errorMessages.invalidDate });

export const personalInfoSchema = z.object({
  firstName: z.string()
    .min(1, { message: errorMessages.required })
    .min(2, { message: errorMessages.minTwoChars }),
  lastName: z.string()
    .min(1, { message: errorMessages.required })
    .min(2, { message: errorMessages.minTwoChars }),
  email: z.string()
    .min(1, { message: errorMessages.required })
    .email({ message: errorMessages.invalidEmail }),
  phone: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  dateOfBirth: dateSchema.optional(),
  placeOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string()
    .min(1, { message: errorMessages.required })
    .min(2, { message: errorMessages.minTwoChars }),
  position: z.string()
    .min(1, { message: errorMessages.required })
    .min(2, { message: errorMessages.minTwoChars }),
  location: z.string().optional(),
  startDate: dateSchema,
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
}).refine(
  (data) => {
    if (!data.current) {
      return data.endDate !== undefined && data.endDate !== '';
    }
    return true;
  },
  {
    message: 'Enddatum ist erforderlich, wenn nicht aktuell',
    path: ['endDate'],
  }
).refine(
  (data) => {
    if (data.endDate && !data.current) {
      const endDateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!endDateRegex.test(data.endDate)) {
        return false;
      }
      const parsed = new Date(data.endDate);
      return !isNaN(parsed.getTime());
    }
    return true;
  },
  {
    message: errorMessages.invalidDate,
    path: ['endDate'],
  }
);

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string()
    .min(1, { message: errorMessages.required })
    .min(2, { message: errorMessages.minTwoChars }),
  degree: z.string()
    .min(1, { message: errorMessages.required })
    .min(2, { message: errorMessages.minTwoChars }),
  field: z.string().optional(),
  location: z.string().optional(),
  startDate: dateSchema,
  endDate: z.string().optional(),
  current: z.boolean().default(false),
}).refine(
  (data) => {
    if (!data.current) {
      return data.endDate !== undefined && data.endDate !== '';
    }
    return true;
  },
  {
    message: 'Enddatum ist erforderlich, wenn nicht aktuell',
    path: ['endDate'],
  }
).refine(
  (data) => {
    if (data.endDate && !data.current) {
      const endDateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!endDateRegex.test(data.endDate)) {
        return false;
      }
      const parsed = new Date(data.endDate);
      return !isNaN(parsed.getTime());
    }
    return true;
  },
  {
    message: errorMessages.invalidDate,
    path: ['endDate'],
  }
);

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string()
    .min(1, { message: errorMessages.required })
    .min(2, { message: errorMessages.minTwoChars }),
  level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Grundkenntnisse', 'Gut', 'Sehr gut', 'Fließend']),
  category: z.enum(['language', 'technical', 'soft']),
});

export const cvDataSchema = z.object({
  personal: personalInfoSchema,
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillSchema).default([]),
  summary: z.string().optional(),
});

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type CVDataInput = z.infer<typeof cvDataSchema>;

export type ValidationError = {
  path: string[];
  message: string;
};

export function validateCVData(data: unknown): {
  success: boolean;
  data?: CVDataInput;
  errors?: ValidationError[];
} {
  const result = cvDataSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  const errors: ValidationError[] = result.error.issues.map((issue) => ({
    path: issue.path.map(String),
    message: issue.message,
  }));

  return {
    success: false,
    errors,
  };
}

export function validatePersonalInfo(data: unknown): {
  success: boolean;
  data?: PersonalInfoInput;
  errors?: ValidationError[];
} {
  const result = personalInfoSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: ValidationError[] = result.error.issues.map((issue) => ({
    path: issue.path.map(String),
    message: issue.message,
  }));

  return { success: false, errors };
}

export function validateExperience(data: unknown): {
  success: boolean;
  data?: ExperienceInput;
  errors?: ValidationError[];
} {
  const result = experienceSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: ValidationError[] = result.error.issues.map((issue) => ({
    path: issue.path.map(String),
    message: issue.message,
  }));

  return { success: false, errors };
}

export function validateEducation(data: unknown): {
  success: boolean;
  data?: EducationInput;
  errors?: ValidationError[];
} {
  const result = educationSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: ValidationError[] = result.error.issues.map((issue) => ({
    path: issue.path.map(String),
    message: issue.message,
  }));

  return { success: false, errors };
}

export function validateSkill(data: unknown): {
  success: boolean;
  data?: SkillInput;
  errors?: ValidationError[];
} {
  const result = skillSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: ValidationError[] = result.error.issues.map((issue) => ({
    path: issue.path.map(String),
    message: issue.message,
  }));

  return { success: false, errors };
}
