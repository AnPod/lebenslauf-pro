'use client';

import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Calendar, Globe } from 'lucide-react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import { formatDateGerman } from '@/lib/pdf';

export function ExecutivePreview({ data }: { data: CVData }) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 min-h-[842px]">
      <div className="bg-[#1e3a5f] text-white p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-5xl font-bold tracking-tight mb-2">
              {data.personal.firstName} {data.personal.lastName}
            </h1>
            <div className="h-1 w-32 bg-[#c9a227] mb-4"></div>
            {data.summary && (
              <p className="text-lg text-gray-200 leading-relaxed max-w-2xl">
                {data.summary}
              </p>
            )}
          </div>
          {data.personal.photoUrl && (
            <div className="ml-8 flex-shrink-0">
              <img
                src={data.personal.photoUrl}
                alt="Profilfoto"
                className="w-36 h-44 object-cover border-4 border-[#c9a227] shadow-lg"
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#0f2744] text-white px-8 py-3">
        <div className="flex flex-wrap gap-6 text-sm">
          {data.personal.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#c9a227]" />
              <span>{data.personal.email}</span>
            </div>
          )}
          {data.personal.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#c9a227]" />
              <span>{data.personal.phone}</span>
            </div>
          )}
          {(data.personal.address || data.personal.city) && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#c9a227]" />
              <span>
                {data.personal.address && `${data.personal.address}, `}
                {data.personal.postalCode} {data.personal.city}
              </span>
            </div>
          )}
          {data.personal.dateOfBirth && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#c9a227]" />
              <span>
                {new Date(data.personal.dateOfBirth).toLocaleDateString('de-DE')}
                {data.personal.placeOfBirth && ` in ${data.personal.placeOfBirth}`}
              </span>
            </div>
          )}
          {data.personal.nationality && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#c9a227]" />
              <span>{data.personal.nationality}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {data.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#c9a227]"></span>
              Berufserfahrung
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="border-l-4 border-[#1e3a5f] pl-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {exp.position}
                      </h3>
                      <p className="text-lg font-semibold text-[#1e3a5f]">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#c9a227] bg-[#1e3a5f] px-3 py-1 rounded whitespace-nowrap">
                      {formatDate(exp.startDate)} –{' '}
                      {exp.current ? 'heute' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.location && (
                    <p className="text-sm text-gray-600 mb-2">{exp.location}</p>
                  )}
                  {exp.description && (
                    <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#c9a227]"></span>
              Ausbildung
            </h2>
            <div className="space-y-6">
              {data.education.map((edu) => (
                <div key={edu.id} className="border-l-4 border-[#1e3a5f] pl-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {edu.degree}
                      </h3>
                      <p className="text-lg font-semibold text-[#1e3a5f]">
                        {edu.institution}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#c9a227] bg-[#1e3a5f] px-3 py-1 rounded whitespace-nowrap">
                      {formatDate(edu.startDate)} –{' '}
                      {edu.current ? 'heute' : formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.field && (
                    <p className="text-sm text-gray-700 mb-1">{edu.field}</p>
                  )}
                  {edu.location && (
                    <p className="text-sm text-gray-600">{edu.location}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.skills.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#c9a227]"></span>
              Fähigkeiten
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-gray-50 border-l-4 border-[#c9a227] p-4"
                >
                  <div className="font-semibold text-gray-900 mb-1">
                    {skill.name}
                  </div>
                  <div className="text-sm text-gray-600">{skill.level}</div>
                </div>
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
  },
  header: {
    backgroundColor: '#1e3a5f',
    color: '#FFFFFF',
    padding: 32,
    flexDirection: 'row',
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  accentLine: {
    width: 128,
    height: 4,
    backgroundColor: '#c9a227',
    marginBottom: 16,
  },
  summary: {
    fontSize: 12,
    color: '#E5E7EB',
    lineHeight: 1.6,
    maxWidth: 400,
  },
  photo: {
    width: 144,
    height: 176,
    marginLeft: 32,
    borderWidth: 4,
    borderColor: '#c9a227',
  },
  contactBar: {
    backgroundColor: '#0f2744',
    color: '#FFFFFF',
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    fontSize: 9,
  },
  contactText: {
    marginLeft: 6,
  },
  mainContent: {
    padding: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1e3a5f',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionAccent: {
    width: 8,
    height: 32,
    backgroundColor: '#c9a227',
    marginRight: 12,
  },
  experienceItem: {
    marginBottom: 24,
    paddingLeft: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#1e3a5f',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  experienceCompany: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: 4,
  },
  experienceDate: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#c9a227',
    backgroundColor: '#1e3a5f',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  experienceLocation: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 4,
  },
  experienceDescription: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.6,
  },
  educationItem: {
    marginBottom: 24,
    paddingLeft: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#1e3a5f',
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  educationDegree: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  educationInstitution: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: 4,
  },
  educationDate: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#c9a227',
    backgroundColor: '#1e3a5f',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  educationField: {
    fontSize: 9,
    color: '#374151',
    marginBottom: 4,
  },
  educationLocation: {
    fontSize: 9,
    color: '#6B7280',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderLeftWidth: 4,
    borderLeftColor: '#c9a227',
    padding: 16,
    marginBottom: 16,
  },
  skillName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  skillLevel: {
    fontSize: 9,
    color: '#6B7280',
  },
});

export function ExecutivePDF({ data }: { data: CVData }) {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <View style={pdfStyles.headerContent}>
            <Text style={pdfStyles.name}>
              {data.personal.firstName} {data.personal.lastName}
            </Text>
            <View style={pdfStyles.accentLine} />
            {data.summary && (
              <Text style={pdfStyles.summary}>{data.summary}</Text>
            )}
          </View>
          {data.personal.photoUrl && (
            <Image src={data.personal.photoUrl} style={pdfStyles.photo} />
          )}
        </View>

        <View style={pdfStyles.contactBar}>
          {data.personal.email && (
            <View style={pdfStyles.contactItem}>
              <Text style={pdfStyles.contactText}>{data.personal.email}</Text>
            </View>
          )}
          {data.personal.phone && (
            <View style={pdfStyles.contactItem}>
              <Text style={pdfStyles.contactText}>{data.personal.phone}</Text>
            </View>
          )}
          {(data.personal.address || data.personal.city) && (
            <View style={pdfStyles.contactItem}>
              <Text style={pdfStyles.contactText}>
                {data.personal.address && `${data.personal.address}, `}
                {data.personal.postalCode} {data.personal.city}
              </Text>
            </View>
          )}
          {data.personal.dateOfBirth && (
            <View style={pdfStyles.contactItem}>
              <Text style={pdfStyles.contactText}>
                {new Date(data.personal.dateOfBirth).toLocaleDateString('de-DE')}
                {data.personal.placeOfBirth &&
                  ` in ${data.personal.placeOfBirth}`}
              </Text>
            </View>
          )}
          {data.personal.nationality && (
            <View style={pdfStyles.contactItem}>
              <Text style={pdfStyles.contactText}>
                {data.personal.nationality}
              </Text>
            </View>
          )}
        </View>

        <View style={pdfStyles.mainContent}>
          {data.experience.length > 0 && (
            <>
              <View style={pdfStyles.sectionTitle}>
                <View style={pdfStyles.sectionAccent} />
                <Text>Berufserfahrung</Text>
              </View>
              {data.experience.map((exp) => (
                <View key={exp.id} style={pdfStyles.experienceItem}>
                  <View style={pdfStyles.experienceHeader}>
                    <View>
                      <Text style={pdfStyles.experienceTitle}>
                        {exp.position}
                      </Text>
                      <Text style={pdfStyles.experienceCompany}>
                        {exp.company}
                      </Text>
                    </View>
                    <Text style={pdfStyles.experienceDate}>
                      {formatDateGerman(exp.startDate)} –{' '}
                      {exp.current ? 'heute' : formatDateGerman(exp.endDate)}
                    </Text>
                  </View>
                  {exp.location && (
                    <Text style={pdfStyles.experienceLocation}>
                      {exp.location}
                    </Text>
                  )}
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
              <View style={pdfStyles.sectionTitle}>
                <View style={pdfStyles.sectionAccent} />
                <Text>Ausbildung</Text>
              </View>
              {data.education.map((edu) => (
                <View key={edu.id} style={pdfStyles.educationItem}>
                  <View style={pdfStyles.educationHeader}>
                    <View>
                      <Text style={pdfStyles.educationDegree}>
                        {edu.degree}
                      </Text>
                      <Text style={pdfStyles.educationInstitution}>
                        {edu.institution}
                      </Text>
                    </View>
                    <Text style={pdfStyles.educationDate}>
                      {formatDateGerman(edu.startDate)} –{' '}
                      {edu.current ? 'heute' : formatDateGerman(edu.endDate)}
                    </Text>
                  </View>
                  {edu.field && (
                    <Text style={pdfStyles.educationField}>{edu.field}</Text>
                  )}
                  {edu.location && (
                    <Text style={pdfStyles.educationLocation}>
                      {edu.location}
                    </Text>
                  )}
                </View>
              ))}
            </>
          )}

          {data.skills.length > 0 && (
            <>
              <View style={pdfStyles.sectionTitle}>
                <View style={pdfStyles.sectionAccent} />
                <Text>Fähigkeiten</Text>
              </View>
              <View style={pdfStyles.skillsGrid}>
                {data.skills.map((skill) => (
                  <View key={skill.id} style={pdfStyles.skillItem}>
                    <Text style={pdfStyles.skillName}>{skill.name}</Text>
                    <Text style={pdfStyles.skillLevel}>{skill.level}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </Page>
    </Document>
  );
}
