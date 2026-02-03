'use client';

import { CVData } from '@/types/cv';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import { formatDateGerman } from '@/lib/pdf';

export function MinimalPreview({ data }: { data: CVData }) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white min-h-[842px]">
      <div className="max-w-2xl mx-auto px-16 py-12">
        <div className="mb-16">
          <h1 className="text-4xl font-light text-gray-900 tracking-tight mb-8">
            {data.personal.firstName} {data.personal.lastName}
          </h1>

          <div className="space-y-1 text-sm text-gray-600 font-light">
            {data.personal.email && <div>{data.personal.email}</div>}
            {data.personal.phone && <div>{data.personal.phone}</div>}
            {(data.personal.address || data.personal.city) && (
              <div>
                {data.personal.address && `${data.personal.address}, `}
                {data.personal.postalCode} {data.personal.city}
              </div>
            )}
          </div>
        </div>

        {(data.personal.dateOfBirth || data.personal.placeOfBirth || data.personal.nationality) && (
          <div className="mb-12">
            <div className="text-sm text-gray-600 font-light space-y-1">
              {data.personal.dateOfBirth && (
                <div>
                  {new Date(data.personal.dateOfBirth).toLocaleDateString('de-DE')}
                  {data.personal.placeOfBirth && ` · ${data.personal.placeOfBirth}`}
                </div>
              )}
              {data.personal.nationality && <div>{data.personal.nationality}</div>}
            </div>
          </div>
        )}

        {data.summary && (
          <div className="mb-12">
            <p className="text-base text-gray-800 leading-loose font-light">
              {data.summary}
            </p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div className="mb-12">
            <div className="space-y-8">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-lg font-normal text-gray-900">
                      {exp.position}
                    </h3>
                    <span className="text-sm text-gray-500 font-light">
                      {formatDate(exp.startDate)} – {exp.current ? 'heute' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-light mb-2">
                    {exp.company}
                    {exp.location && ` · ${exp.location}`}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-gray-700 leading-relaxed font-light">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div className="mb-12">
            <div className="space-y-8">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-lg font-normal text-gray-900">
                      {edu.degree}
                    </h3>
                    <span className="text-sm text-gray-500 font-light">
                      {formatDate(edu.startDate)} – {edu.current ? 'heute' : formatDate(edu.endDate)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-light mb-1">
                    {edu.institution}
                    {edu.location && ` · ${edu.location}`}
                  </p>
                  {edu.field && (
                    <p className="text-sm text-gray-600 font-light">
                      {edu.field}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.skills.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 font-light">
              {data.skills.map((skill) => (
                <span key={skill.id}>
                  {skill.name}
                  <span className="text-gray-400"> · </span>
                  {skill.level}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    padding: 48,
  },
  name: {
    fontSize: 32,
    fontWeight: 300,
    marginBottom: 32,
    color: '#111827',
  },
  contactInfo: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: 300,
  },
  personalInfo: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: 300,
  },
  summary: {
    fontSize: 11,
    color: '#1F2937',
    lineHeight: 1.8,
    marginBottom: 48,
    fontWeight: 300,
  },
  experienceItem: {
    marginBottom: 32,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  experienceTitle: {
    fontSize: 14,
    fontWeight: 400,
    color: '#111827',
  },
  experienceDate: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: 300,
  },
  experienceCompany: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: 300,
  },
  experienceDescription: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.6,
    fontWeight: 300,
  },
  educationItem: {
    marginBottom: 32,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  educationDegree: {
    fontSize: 14,
    fontWeight: 400,
    color: '#111827',
  },
  educationDate: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: 300,
  },
  educationInstitution: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: 300,
  },
  educationField: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: 300,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    marginRight: 24,
    marginBottom: 4,
    flexDirection: 'row',
  },
  skillName: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: 300,
  },
  skillSeparator: {
    fontSize: 10,
    color: '#D1D5DB',
    marginHorizontal: 4,
  },
  skillLevel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: 300,
  },
});

export function MinimalPDF({ data }: { data: CVData }) {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.name}>
          {data.personal.firstName} {data.personal.lastName}
        </Text>

        {data.personal.email && (
          <Text style={pdfStyles.contactInfo}>{data.personal.email}</Text>
        )}
        {data.personal.phone && (
          <Text style={pdfStyles.contactInfo}>{data.personal.phone}</Text>
        )}
        {(data.personal.address || data.personal.city) && (
          <Text style={pdfStyles.contactInfo}>
            {data.personal.address && `${data.personal.address}, `}
            {data.personal.postalCode} {data.personal.city}
          </Text>
        )}

        {(data.personal.dateOfBirth || data.personal.placeOfBirth || data.personal.nationality) && (
          <>
            {data.personal.dateOfBirth && (
              <Text style={pdfStyles.personalInfo}>
                {new Date(data.personal.dateOfBirth).toLocaleDateString('de-DE')}
                {data.personal.placeOfBirth && ` · ${data.personal.placeOfBirth}`}
              </Text>
            )}
            {data.personal.nationality && (
              <Text style={pdfStyles.personalInfo}>{data.personal.nationality}</Text>
            )}
          </>
        )}

        {data.summary && (
          <Text style={pdfStyles.summary}>{data.summary}</Text>
        )}

        {data.experience.length > 0 && (
          <>
            {data.experience.map((exp) => (
              <View key={exp.id} style={pdfStyles.experienceItem}>
                <View style={pdfStyles.experienceHeader}>
                  <Text style={pdfStyles.experienceTitle}>{exp.position}</Text>
                  <Text style={pdfStyles.experienceDate}>
                    {formatDateGerman(exp.startDate)} –{' '}
                    {exp.current ? 'heute' : formatDateGerman(exp.endDate)}
                  </Text>
                </View>
                <Text style={pdfStyles.experienceCompany}>
                  {exp.company}
                  {exp.location && ` · ${exp.location}`}
                </Text>
                {exp.description && (
                  <Text style={pdfStyles.experienceDescription}>
                    {exp.description}
                  </Text>
                )}
              </View>
            ))}
          </>
        )}

        {data.education.length > 0 && (
          <>
            {data.education.map((edu) => (
              <View key={edu.id} style={pdfStyles.educationItem}>
                <View style={pdfStyles.educationHeader}>
                  <Text style={pdfStyles.educationDegree}>{edu.degree}</Text>
                  <Text style={pdfStyles.educationDate}>
                    {formatDateGerman(edu.startDate)} –{' '}
                    {edu.current ? 'heute' : formatDateGerman(edu.endDate)}
                  </Text>
                </View>
                <Text style={pdfStyles.educationInstitution}>
                  {edu.institution}
                  {edu.location && ` · ${edu.location}`}
                </Text>
                {edu.field && (
                  <Text style={pdfStyles.educationField}>{edu.field}</Text>
                )}
              </View>
            ))}
          </>
        )}

        {data.skills.length > 0 && (
          <View style={pdfStyles.skillsContainer}>
            {data.skills.map((skill) => (
              <View key={skill.id} style={pdfStyles.skillItem}>
                <Text style={pdfStyles.skillName}>{skill.name}</Text>
                <Text style={pdfStyles.skillSeparator}>·</Text>
                <Text style={pdfStyles.skillLevel}>{skill.level}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
