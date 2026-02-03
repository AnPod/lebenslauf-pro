import { describe, it, expect, mock } from 'bun:test';
import {
  formatDateGerman,
  generatePDFBlob,
  generatePDFBase64,
  downloadPDF,
  generatePDFDataURL,
} from '@/lib/pdf';
import { CVData } from '@/types/cv';

const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });

const mockPDFRenderer = {
  pdf: mock(() => ({
    toBlob: mock(() => Promise.resolve(mockBlob)),
    toString: mock(() => Promise.resolve('JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmogICUgcGFnZXMKPDwKICAvVHlwZSAvUGFnZXwKICAvTWVkaWFCb3ggWyAwIDAgNTk1LjI4IDg0MS44OSBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqICAlIHBhZ2UgMQo8PAogIC9UeXBlIC9QYWdlCiAgL1BhcmVudCAyIDAgUgogIC9SZXNvdXJjZXMgPDwKICAgIC9Gb250IDw8CiAgICAgIC9GMSA0IDAgUgogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmogICUgZm9udAo8PAogIC9UeXBlIC9Gb250CiAgL1N1YnR5cGUgL1R5cGUxCiAgL0Jhc2VGb250IC9IZWx2ZXRpY2EKPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAyNCBUZgooSGVsbG8sIFdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDE1NyAwMDAwMCBuIAowMDAwMDAwMjU4IDAwMDAwIG4gCjAwMDAwMDAzNDQgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDM5CiUlRU9GCg==')),
  })),
  Document: mock(() => {}),
  Page: mock(() => {}),
  Text: mock(() => {}),
  View: mock(() => {}),
  Image: mock(() => {}),
  StyleSheet: {
    create: mock(() => ({})),
  },
};

mock.module('@react-pdf/renderer', () => mockPDFRenderer);

const mockCVData: CVData = {
  personal: {
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max.mustermann@example.com',
    phone: '+49 123 456789',
    address: 'Musterstraße 1',
    postalCode: '12345',
    city: 'Berlin',
    dateOfBirth: '1990-01-15',
    placeOfBirth: 'München',
    nationality: 'Deutsch',
  },
  experience: [
    {
      id: '1',
      company: 'Tech GmbH',
      position: 'Senior Developer',
      location: 'Berlin',
      startDate: '2020-01-01',
      endDate: '2023-12-31',
      current: false,
      description: 'Entwicklung von Webanwendungen',
    },
    {
      id: '2',
      company: 'StartUp AG',
      position: 'Developer',
      location: 'München',
      startDate: '2018-06-01',
      endDate: '',
      current: true,
      description: 'Full-Stack Entwicklung',
    },
  ],
  education: [
    {
      id: '1',
      institution: 'Technische Universität Berlin',
      degree: 'Master',
      field: 'Informatik',
      location: 'Berlin',
      startDate: '2016-10-01',
      endDate: '2019-09-30',
      current: false,
    },
  ],
  skills: [
    {
      id: '1',
      name: 'Deutsch',
      level: 'C2',
      category: 'language',
    },
    {
      id: '2',
      name: 'Englisch',
      level: 'C1',
      category: 'language',
    },
    {
      id: '3',
      name: 'TypeScript',
      level: 'Sehr gut',
      category: 'technical',
    },
    {
      id: '4',
      name: 'React',
      level: 'Sehr gut',
      category: 'technical',
    },
  ],
  summary: 'Erfahrener Softwareentwickler mit Fokus auf Webtechnologien.',
};

describe('formatDateGerman', () => {
  it('should format date to German format (MM.YYYY)', () => {
    const result = formatDateGerman('2020-01-15');
    expect(result).toBe('01.2020');
  });

  it('should format date with single digit month', () => {
    const result = formatDateGerman('2020-06-01');
    expect(result).toBe('06.2020');
  });

  it('should return empty string for empty input', () => {
    const result = formatDateGerman('');
    expect(result).toBe('');
  });

  it('should return empty string for invalid date', () => {
    const result = formatDateGerman('invalid-date');
    expect(result).toBe('');
  });
});

describe('generatePDFBlob', () => {
  it('should generate a PDF blob from CV data', async () => {
    const mockToBlob = mock(() => Promise.resolve(mockBlob));
    
    const blob = await generatePDFBlob(mockCVData);
    
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/pdf');
  });

  it('should generate PDF blob with minimal CV data', async () => {
    const minimalData: CVData = {
      personal: {
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@example.com',
      },
      experience: [],
      education: [],
      skills: [],
      summary: '',
    };
    
    const blob = await generatePDFBlob(minimalData);
    
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/pdf');
  });
});

describe('generatePDFBase64', () => {
  it('should generate PDF as base64 string', async () => {
    const base64 = await generatePDFBase64(mockCVData);
    
    expect(typeof base64).toBe('string');
    expect(base64.length).toBeGreaterThan(0);
  });

  it('should generate base64 for minimal CV data', async () => {
    const minimalData: CVData = {
      personal: {
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@example.com',
      },
      experience: [],
      education: [],
      skills: [],
      summary: '',
    };
    
    const base64 = await generatePDFBase64(minimalData);
    
    expect(typeof base64).toBe('string');
    expect(base64.length).toBeGreaterThan(0);
  });
});

describe('generatePDFDataURL', () => {
  it('should generate PDF data URL', async () => {
    const dataUrl = await generatePDFDataURL(mockCVData);
    
    expect(typeof dataUrl).toBe('string');
    expect(dataUrl).toMatch(/^blob:/);
  });

  it('should generate unique data URLs for each call', async () => {
    const url1 = await generatePDFDataURL(mockCVData);
    const url2 = await generatePDFDataURL(mockCVData);
    
    expect(url1).not.toBe(url2);
  });
});

describe('downloadPDF', () => {
  it('should trigger PDF download', async () => {
    const mockLink = {
      href: '',
      download: '',
      click: mock(() => {}),
    };
    
    const mockCreateElement = mock(() => mockLink);
    const mockAppendChild = mock(() => {});
    const mockRemoveChild = mock(() => {});
    const mockRevokeObjectURL = mock(() => {});
    
    global.document = {
      createElement: mockCreateElement,
      body: {
        appendChild: mockAppendChild,
        removeChild: mockRemoveChild,
      },
    } as any;
    
    global.URL = {
      createObjectURL: mock(() => 'blob:test-url'),
      revokeObjectURL: mockRevokeObjectURL,
    } as any;
    
    await downloadPDF(mockCVData);
    
    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockLink.click).toHaveBeenCalled();
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  it('should use custom filename when provided', async () => {
    const mockLink = {
      href: '',
      download: '',
      click: mock(() => {}),
    };
    
    const mockCreateElement = mock(() => mockLink);
    const mockAppendChild = mock(() => {});
    const mockRemoveChild = mock(() => {});
    const mockRevokeObjectURL = mock(() => {});
    
    global.document = {
      createElement: mockCreateElement,
      body: {
        appendChild: mockAppendChild,
        removeChild: mockRemoveChild,
      },
    } as any;
    
    global.URL = {
      createObjectURL: mock(() => 'blob:test-url'),
      revokeObjectURL: mockRevokeObjectURL,
    } as any;
    
    await downloadPDF(mockCVData, 'custom-filename.pdf');
    
    expect(mockLink.download).toBe('custom-filename.pdf');
  });

  it('should generate default filename from personal info', async () => {
    const mockLink = {
      href: '',
      download: '',
      click: mock(() => {}),
    };
    
    const mockCreateElement = mock(() => mockLink);
    const mockAppendChild = mock(() => {});
    const mockRemoveChild = mock(() => {});
    const mockRevokeObjectURL = mock(() => {});
    
    global.document = {
      createElement: mockCreateElement,
      body: {
        appendChild: mockAppendChild,
        removeChild: mockRemoveChild,
      },
    } as any;
    
    global.URL = {
      createObjectURL: mock(() => 'blob:test-url'),
      revokeObjectURL: mockRevokeObjectURL,
    } as any;
    
    await downloadPDF(mockCVData);
    
    expect(mockLink.download).toBe('Max_Mustermann_Lebenslauf.pdf');
  });
});

describe('PDF generation with various data scenarios', () => {
  it('should handle CV with only personal info', async () => {
    const data: CVData = {
      personal: {
        firstName: 'Anna',
        lastName: 'Schmidt',
        email: 'anna@example.com',
      },
      experience: [],
      education: [],
      skills: [],
      summary: '',
    };
    
    const blob = await generatePDFBlob(data);
    expect(blob).toBeInstanceOf(Blob);
  });

  it('should handle CV with all sections populated', async () => {
    const blob = await generatePDFBlob(mockCVData);
    expect(blob).toBeInstanceOf(Blob);
  });

  it('should handle CV with current position', async () => {
    const data: CVData = {
      ...mockCVData,
      experience: [
        {
          id: '1',
          company: 'Current Company',
          position: 'Current Role',
          location: 'Berlin',
          startDate: '2023-01-01',
          endDate: '',
          current: true,
          description: 'Current work',
        },
      ],
    };
    
    const blob = await generatePDFBlob(data);
    expect(blob).toBeInstanceOf(Blob);
  });

  it('should handle CV with current education', async () => {
    const data: CVData = {
      ...mockCVData,
      education: [
        {
          id: '1',
          institution: 'Current University',
          degree: 'PhD',
          field: 'Computer Science',
          location: 'Berlin',
          startDate: '2023-10-01',
          endDate: '',
          current: true,
        },
      ],
    };
    
    const blob = await generatePDFBlob(data);
    expect(blob).toBeInstanceOf(Blob);
  });

  it('should handle CV with mixed skill categories', async () => {
    const data: CVData = {
      ...mockCVData,
      skills: [
        { id: '1', name: 'Deutsch', level: 'C2', category: 'language' },
        { id: '2', name: 'Python', level: 'Sehr gut', category: 'technical' },
        { id: '3', name: 'Kommunikation', level: 'Gut', category: 'soft' },
      ],
    };
    
    const blob = await generatePDFBlob(data);
    expect(blob).toBeInstanceOf(Blob);
  });
});
