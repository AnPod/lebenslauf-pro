import { CVData } from '@/types/cv';

export interface RedactedCVData {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    dateOfBirth: string;
    placeOfBirth: string;
    nationality: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    location: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    location: string;
  }>;
  skills: Array<{
    name: string;
    level: string;
    category: string;
  }>;
}

export function redactPII(cvData: CVData): RedactedCVData {
  return {
    personal: {
      firstName: '[VORNAME]',
      lastName: '[NACHNAME]',
      email: '[EMAIL]',
      phone: '[TELEFON]',
      address: '[ADRESSE]',
      city: '[STADT]',
      dateOfBirth: '[GEBURTSDATUM]',
      placeOfBirth: '[GEBURTSORT]',
      nationality: cvData.personal.nationality,
    },
    summary: cvData.summary,
    experience: cvData.experience.map(exp => ({
      company: exp.company,
      position: exp.position,
      location: exp.location,
      description: exp.description,
    })),
    education: cvData.education.map(edu => ({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      location: edu.location,
    })),
    skills: cvData.skills.map(skill => ({
      name: skill.name,
      level: skill.level,
      category: skill.category,
    })),
  };
}

/**
 * Redacts personally identifiable information from text using regex patterns.
 * Preserves context for cover letter generation by replacing with placeholders.
 *
 * @param text - The text to redact PII from
 * @returns Text with PII replaced by placeholders
 */
export function redactTextPII(text: string): string {
  let redacted = text;

  // Email addresses
  redacted = redacted.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    '[EMAIL]'
  );

  // Phone numbers (various formats)
  // International format: +49 123 4567890
  redacted = redacted.replace(
    /\+\d{1,3}[\s-]?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,9}/g,
    '[TELEFON]'
  );
  // German format: 0123 4567890 or 0123/4567890
  redacted = redacted.replace(
    /0\d{2,4}[\s/-]?\d{3,8}[\s/-]?\d{1,8}/g,
    '[TELEFON]'
  );
  // US format: (123) 456-7890
  redacted = redacted.replace(
    /\(\d{3}\)\s?\d{3}[-.\s]?\d{4}/g,
    '[TELEFON]'
  );

  // Addresses (street + number pattern)
  // German format: Musterstraße 123 (street type as part of name)
  redacted = redacted.replace(
    /\b[A-ZÄÖÜ][a-zäöüß]+(?:straße|str\.|gasse|platz|allee|damm|ring)\s*\d+[a-zA-Z]?\b/gi,
    '[ADRESSE]'
  );
  // German format: Berliner Weg 10 (street name followed by street type)
  redacted = redacted.replace(
    /\b[A-ZÄÖÜ][a-zäöüß]+\s+(?:weg|straße|gasse|platz|allee|damm|ring)\s+\d+[a-zA-Z]?\b/gi,
    '[ADRESSE]'
  );
  // International format: 123 Main Street
  redacted = redacted.replace(
    /\b\d+\s+[A-Z][a-z]+\s+(?:Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Boulevard|Blvd|Way|Court|Ct|Place|Pl)\b/gi,
    '[ADRESSE]'
  );

  // Names (simple pattern - capital letter followed by lowercase letters)
  // This is a basic pattern and may have false positives
  // We'll avoid redacting common words and company names
  const commonWords = new Set([
    'und', 'oder', 'der', 'die', 'das', 'ein', 'eine', 'einer', 'einen',
    'mit', 'für', 'von', 'bei', 'auf', 'in', 'an', 'zu', 'aus', 'über',
    'als', 'wie', 'durch', 'nach', 'vor', 'während', 'seit', 'bis',
    'the', 'and', 'for', 'with', 'from', 'at', 'in', 'on', 'to', 'of',
    'by', 'as', 'through', 'after', 'before', 'during', 'since', 'until',
    'GmbH', 'AG', 'KG', 'Inc', 'LLC', 'Ltd', 'Co', 'Corp', 'Company',
    'Team', 'Group', 'Department', 'Abteilung', 'Bereich', 'Firma',
    'Position', 'Stelle', 'Rolle', 'Job', 'Arbeit', 'Beruf', 'Karriere',
    'Erfahrung', 'Qualifikation', 'Skill', 'Fähigkeit', 'Kenntnis',
    'Projekt', 'Aufgabe', 'Ziel', 'Ergebnis', 'Erfolg', 'Leistung',
    'Software', 'System', 'Anwendung', 'Plattform', 'Tool', 'Lösung',
    'Kunde', 'User', 'Benutzer', 'Mitarbeiter', 'Teammitglied',
    'Manager', 'Leiter', 'Chef', 'Director', 'Head', 'Lead',
    'Developer', 'Engineer', 'Designer', 'Consultant', 'Analyst',
    'Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt', 'Stuttgart',
    'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden',
    'Hannover', 'Nürnberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld',
    'Bonn', 'Münster', 'Karlsruhe', 'Mannheim', 'Augsburg', 'Wiesbaden',
    'New', 'York', 'London', 'Paris', 'Madrid', 'Rome', 'Vienna',
    'Prague', 'Warsaw', 'Budapest', 'Zurich', 'Amsterdam', 'Brussels',
    'Munich', 'Mann', 'Frau', 'Kind', 'Jahr', 'Zeit', 'Tag', 'Woche',
    'Monat', 'Stunde', 'Minute', 'Sekunde', 'Weg', 'Straße', 'Platz',
  ]);

  // Pattern for names: Capital letter followed by lowercase letters, 2-20 chars
  // Only redact if not in common words and appears in certain contexts
  redacted = redacted.replace(
    /\b([A-ZÄÖÜ][a-zäöüß]{1,19})\b/g,
    (match, name, offset) => {
      // Don't redact if it's a common word
      if (commonWords.has(name)) {
        return match;
      }
      // Don't redact if it's at the start of a sentence (likely not a name)
      if (match === text.trim().split(/\s+/)[0]) {
        return match;
      }
      // Don't redact if it's followed by common title patterns
      if (match.match(/(?:straße|str\.|weg|gasse|platz|allee|damm|ring|Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Boulevard|Blvd|Way|Court|Ct|Place|Pl)$/i)) {
        return match;
      }
      // Don't redact if it's followed by company suffixes (check next word in original text)
      const nextWordMatch = text.substring(offset + match.length).match(/^\s+([A-ZÄÖÜ][a-zA-Zäöüß]{1,19})/);
      if (nextWordMatch) {
        const nextWord = nextWordMatch[1];
        // Check if next word is a company abbreviation or common word
        if (commonWords.has(nextWord) || ['GmbH', 'AG', 'KG', 'Inc', 'LLC', 'Ltd', 'Co', 'Corp'].includes(nextWord)) {
          return match;
        }
      }
      return '[NAME]';
    }
  );

  return redacted;
}
