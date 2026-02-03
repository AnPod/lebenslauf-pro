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

export function ClassicPreview({ data }: { data: CVData }) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white p-8 shadow-sm border border-gray-200 font-serif min-h-[842px]">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {data.personal.firstName} {data.personal.lastName}
            </h1>
            <div className="text-sm text-gray-700 space-y-1">
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
          {data.personal.photoUrl && (
            <div className="ml-6 flex-shrink-0">
              <img
                src={data.personal.photoUrl}
                alt="Profilfoto"
                className="w-32 h-40 object-cover border border-gray-300"
              />
            </div>
          )}
        </div>
      </div>

      {(data.personal.dateOfBirth || data.personal.placeOfBirth || data.personal.nationality) && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 border-b-2 border-gray-800 pb-1 mb-3 uppercase">
            Persönliche Daten
          </h2>
          <div className="text-sm text-gray-700 space-y-1">
            {data.personal.dateOfBirth && (
              <div>
                Geburtsdatum: {new Date(data.personal.dateOfBirth).toLocaleDateString('de-DE')}
                {data.personal.placeOfBirth && ` in ${data.personal.placeOfBirth}`}
              </div>
            )}
            {data.personal.nationality && (
              <div>Staatsangehörigkeit: {data.personal.nationality}</div>
            )}
          </div>
        </div>
      )}

      {data.summary && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 border-b-2 border-gray-800 pb-1 mb-3 uppercase">
            Profil
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 border-b-2 border-gray-800 pb-1 mb-3 uppercase">
            Berufserfahrung
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm">{exp.position}</h3>
                    <p className="text-gray-700 text-sm italic">{exp.company}</p>
                    {exp.location && <p className="text-xs text-gray-600">{exp.location}</p>}
                  </div>
                  <span className="text-xs text-gray-600 text-right whitespace-nowrap ml-4">
                    {formatDate(exp.startDate)} – {exp.current ? 'heute' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-sm text-gray-700 leading-relaxed mt-1">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 border-b-2 border-gray-800 pb-1 mb-3 uppercase">
            Ausbildung
          </h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm">{edu.degree}</h3>
                    <p className="text-gray-700 text-sm italic">{edu.institution}</p>
                    {edu.field && <p className="text-xs text-gray-600">{edu.field}</p>}
                    {edu.location && <p className="text-xs text-gray-600">{edu.location}</p>}
                  </div>
                  <span className="text-xs text-gray-600 text-right whitespace-nowrap ml-4">
                    {formatDate(edu.startDate)} – {edu.current ? 'heute' : formatDate(edu.endDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.skills.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-900 border-b-2 border-gray-800 pb-1 mb-3 uppercase">
            Fähigkeiten
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {data.skills.map((skill) => (
              <div key={skill.id} className="flex justify-between text-sm">
                <span className="text-gray-700">{skill.name}</span>
                <span className="text-gray-600">{skill.level}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Times-Roman',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
  },
  contactInfo: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 4,
  },
  photo: {
    width: 128,
    height: 160,
    marginLeft: 24,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
    borderBottomWidth: 2,
    borderBottomColor: '#1F2937',
    paddingBottom: 4,
    textTransform: 'uppercase',
  },
  personalInfo: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 4,
  },
  summary: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.6,
    marginBottom: 24,
  },
  experienceItem: {
    marginBottom: 16,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  experienceTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  experienceDate: {
    fontSize: 9,
    color: '#6B7280',
    marginLeft: 16,
  },
  experienceCompany: {
    fontSize: 10,
    color: '#374151',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  experienceLocation: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 4,
  },
  experienceDescription: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
  },
  educationItem: {
    marginBottom: 16,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  educationDegree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  educationDate: {
    fontSize: 9,
    color: '#6B7280',
    marginLeft: 16,
  },
  educationInstitution: {
    fontSize: 10,
    color: '#374151',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  educationField: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 2,
  },
  educationLocation: {
    fontSize: 8,
    color: '#6B7280',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  skillName: {
    fontSize: 10,
    color: '#374151',
  },
  skillLevel: {
    fontSize: 10,
    color: '#6B7280',
  },
});

export function ClassicPDF({ data }: { data: CVData }) {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <View style={pdfStyles.headerContent}>
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
          </View>
          {data.personal.photoUrl && (
            <Image src={data.personal.photoUrl} style={pdfStyles.photo} />
          )}
        </View>

        {(data.personal.dateOfBirth || data.personal.placeOfBirth || data.personal.nationality) && (
          <>
            <Text style={pdfStyles.sectionTitle}>Persönliche Daten</Text>
            {data.personal.dateOfBirth && (
              <Text style={pdfStyles.personalInfo}>
                Geburtsdatum: {new Date(data.personal.dateOfBirth).toLocaleDateString('de-DE')}
                {data.personal.placeOfBirth && ` in ${data.personal.placeOfBirth}`}
              </Text>
            )}
            {data.personal.nationality && (
              <Text style={pdfStyles.personalInfo}>
                Staatsangehörigkeit: {data.personal.nationality}
              </Text>
            )}
          </>
        )}

        {data.summary && (
          <>
            <Text style={pdfStyles.sectionTitle}>Profil</Text>
            <Text style={pdfStyles.summary}>{data.summary}</Text>
          </>
        )}

        {data.experience.length > 0 && (
          <>
            <Text style={pdfStyles.sectionTitle}>Berufserfahrung</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={pdfStyles.experienceItem}>
                <View style={pdfStyles.experienceHeader}>
                  <Text style={pdfStyles.experienceTitle}>{exp.position}</Text>
                  <Text style={pdfStyles.experienceDate}>
                    {formatDateGerman(exp.startDate)} –{' '}
                    {exp.current ? 'heute' : formatDateGerman(exp.endDate)}
                  </Text>
                </View>
                <Text style={pdfStyles.experienceCompany}>{exp.company}</Text>
                {exp.location && (
                  <Text style={pdfStyles.experienceLocation}>{exp.location}</Text>
                )}
                {exp.description && (
                  <Text style={pdfStyles.experienceDescription}>{exp.description}</Text>
                )}
              </View>
            ))}
          </>
        )}

        {data.education.length > 0 && (
          <>
            <Text style={pdfStyles.sectionTitle}>Ausbildung</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={pdfStyles.educationItem}>
                <View style={pdfStyles.educationHeader}>
                  <Text style={pdfStyles.educationDegree}>{edu.degree}</Text>
                  <Text style={pdfStyles.educationDate}>
                    {formatDateGerman(edu.startDate)} –{' '}
                    {edu.current ? 'heute' : formatDateGerman(edu.endDate)}
                  </Text>
                </View>
                <Text style={pdfStyles.educationInstitution}>{edu.institution}</Text>
                {edu.field && <Text style={pdfStyles.educationField}>{edu.field}</Text>}
                {edu.location && <Text style={pdfStyles.educationLocation}>{edu.location}</Text>}
              </View>
            ))}
          </>
        )}

        {data.skills.length > 0 && (
          <>
            <Text style={pdfStyles.sectionTitle}>Fähigkeiten</Text>
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
      </Page>
    </Document>
  );
}
