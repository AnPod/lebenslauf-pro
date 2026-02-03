import type { CVData } from '@/types/cv';

export interface SectionProgress {
  name: string;
  completed: number;
  total: number;
  percentage: number;
}

export interface ProgressResult {
  overall: number;
  sections: SectionProgress[];
}

const SECTION_REQUIREMENTS = {
  personal: {
    name: 'Personal',
    requiredFields: ['firstName', 'lastName', 'email'] as const,
    optionalFields: ['phone', 'address', 'postalCode', 'city', 'dateOfBirth', 'placeOfBirth', 'nationality', 'photoUrl'] as const,
  },
  experience: {
    name: 'Experience',
    minEntries: 1,
    requiredFieldsPerEntry: ['company', 'position', 'startDate'] as const,
  },
  education: {
    name: 'Education',
    minEntries: 1,
    requiredFieldsPerEntry: ['institution', 'degree', 'startDate'] as const,
  },
  skills: {
    name: 'Skills',
    minEntries: 1,
    requiredFieldsPerEntry: ['name', 'level'] as const,
  },
  summary: {
    name: 'Summary',
    minLength: 50,
  },
} as const;

/**
 * Calculate completion percentage for Personal section
 */
function calculatePersonalProgress(personal: CVData['personal']): SectionProgress {
  const { requiredFields, optionalFields } = SECTION_REQUIREMENTS.personal;
  
  let completed = 0;
  let total = requiredFields.length + optionalFields.length;

  for (const field of requiredFields) {
    if (personal[field] && personal[field].trim().length > 0) {
      completed++;
    }
  }

  for (const field of optionalFields) {
    const value = personal[field as keyof typeof personal];
    if (value && (typeof value === 'string' ? value.trim().length > 0 : true)) {
      completed++;
    }
  }

  return {
    name: SECTION_REQUIREMENTS.personal.name,
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
  };
}

/**
 * Calculate completion percentage for Experience section
 */
function calculateExperienceProgress(experience: CVData['experience']): SectionProgress {
  const { minEntries, requiredFieldsPerEntry } = SECTION_REQUIREMENTS.experience;
  
  let completed = 0;
  let total = minEntries * requiredFieldsPerEntry.length;

  const entriesToCheck = experience.slice(0, minEntries);
  
  for (const entry of entriesToCheck) {
    for (const field of requiredFieldsPerEntry) {
      if (entry[field] && entry[field].trim().length > 0) {
        completed++;
      }
    }
  }

  return {
    name: SECTION_REQUIREMENTS.experience.name,
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
  };
}

/**
 * Calculate completion percentage for Education section
 */
function calculateEducationProgress(education: CVData['education']): SectionProgress {
  const { minEntries, requiredFieldsPerEntry } = SECTION_REQUIREMENTS.education;
  
  let completed = 0;
  let total = minEntries * requiredFieldsPerEntry.length;

  const entriesToCheck = education.slice(0, minEntries);
  
  for (const entry of entriesToCheck) {
    for (const field of requiredFieldsPerEntry) {
      if (entry[field] && entry[field].trim().length > 0) {
        completed++;
      }
    }
  }

  return {
    name: SECTION_REQUIREMENTS.education.name,
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
  };
}

/**
 * Calculate completion percentage for Skills section
 */
function calculateSkillsProgress(skills: CVData['skills']): SectionProgress {
  const { minEntries, requiredFieldsPerEntry } = SECTION_REQUIREMENTS.skills;
  
  let completed = 0;
  let total = minEntries * requiredFieldsPerEntry.length;

  const entriesToCheck = skills.slice(0, minEntries);
  
  for (const entry of entriesToCheck) {
    for (const field of requiredFieldsPerEntry) {
      if (entry[field] && entry[field].trim().length > 0) {
        completed++;
      }
    }
  }

  return {
    name: SECTION_REQUIREMENTS.skills.name,
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
  };
}

/**
 * Calculate completion percentage for Summary section
 */
function calculateSummaryProgress(summary: CVData['summary']): SectionProgress {
  const { minLength } = SECTION_REQUIREMENTS.summary;
  
  const completed = summary.trim().length >= minLength ? 1 : 0;
  const total = 1;

  return {
    name: SECTION_REQUIREMENTS.summary.name,
    completed,
    total,
    percentage: completed * 100,
  };
}

/**
 * Calculate overall CV completion percentage
 */
export function calculateProgress(cvData: CVData): ProgressResult {
  const sections: SectionProgress[] = [
    calculatePersonalProgress(cvData.personal),
    calculateExperienceProgress(cvData.experience),
    calculateEducationProgress(cvData.education),
    calculateSkillsProgress(cvData.skills),
    calculateSummaryProgress(cvData.summary),
  ];

  const overallPercentage = Math.round(
    sections.reduce((sum, section) => sum + section.percentage, 0) / sections.length
  );

  return {
    overall: overallPercentage,
    sections,
  };
}

/**
 * Get completion status label
 */
export function getCompletionStatus(percentage: number): string {
  if (percentage === 0) return 'Not started';
  if (percentage < 25) return 'Just started';
  if (percentage < 50) return 'In progress';
  if (percentage < 75) return 'Almost there';
  if (percentage < 100) return 'Nearly complete';
  return 'Complete';
}
