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

export function ModernPreview({ data }: { data: CVData }) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 min-h-[842px]">
      <div className="flex">
        <div className="w-1/3 bg-[#2563eb] text-white p-6">
          {data.personal.photoUrl && (
            <div className="mb-6">
              <img
                src={data.personal.photoUrl}
                alt="Profilfoto"
                className="w-32 h-40 object-cover rounded-lg mx-auto border-4 border-white/20"
              />
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-white/80">
              Persönlich
            </h3>
            <div className="space-y-2 text-sm">
              {data.personal.dateOfBirth && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {new Date(data.personal.dateOfBirth).toLocaleDateString('de-DE')}
                    {data.personal.placeOfBirth && ` in ${data.personal.placeOfBirth}`}
                  </span>
                </div>
              )}
              {data.personal.nationality && (
                <div className="flex items-start gap-2">
                  <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{data.personal.nationality}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-white/80">
              Kontakt
            </h3>
            <div className="space-y-2 text-sm">
              {data.personal.email && (
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="break-all">{data.personal.email}</span>
                </div>
              )}
              {data.personal.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{data.personal.phone}</span>
                </div>
              )}
              {(data.personal.address || data.personal.city) && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {data.personal.address && `${data.personal.address}, `}
                    {data.personal.postalCode} {data.personal.city}
                  </span>
                </div>
              )}
            </div>
          </div>

          {data.skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-white/80">
                Fähigkeiten
              </h3>
              <div className="space-y-3">
                {data.skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="text-sm font-medium mb-1">{skill.name}</div>
                    <div className="w-full bg-white/20 rounded-full h-1.5">
                      <div
                        className="bg-white rounded-full h-1.5"
                        style={{
                          width: `${(parseInt(skill.level.replace(/\D/g, '')) || 50)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-2/3 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {data.personal.firstName} {data.personal.lastName}
            </h1>
          </div>

          {data.summary && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-[#2563eb] mb-2 uppercase tracking-wider">
                Profil
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
            </div>
          )}

          {data.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-[#2563eb] mb-3 uppercase tracking-wider">
                Berufserfahrung
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-[#2563eb] pl-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900 text-base">
                        {exp.position}
                      </h3>
                      <span className="text-xs text-gray-600 whitespace-nowrap ml-2">
                        {formatDate(exp.startDate)} –{' '}
                        {exp.current ? 'heute' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <p className="text-sm text-[#2563eb] font-medium mb-1">
                      {exp.company}
                    </p>
                    {exp.location && (
                      <p className="text-xs text-gray-600 mb-1">{exp.location}</p>
                    )}
                    {exp.description && (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.education.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-[#2563eb] mb-3 uppercase tracking-wider">
                Ausbildung
              </h2>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-[#2563eb] pl-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900 text-base">
                        {edu.degree}
                      </h3>
                      <span className="text-xs text-gray-600 whitespace-nowrap ml-2">
                        {formatDate(edu.startDate)} –{' '}
                        {edu.current ? 'heute' : formatDate(edu.endDate)}
                      </span>
                    </div>
                    <p className="text-sm text-[#2563eb] font-medium mb-1">
                      {edu.institution}
                    </p>
                    {edu.field && (
                      <p className="text-sm text-gray-700 mb-1">{edu.field}</p>
                    )}
                    {edu.location && (
                      <p className="text-xs text-gray-600">{edu.location}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  sidebar: {
    width: '33%',
    backgroundColor: '#2563eb',
    padding: 24,
    color: '#FFFFFF',
  },
  mainContent: {
    width: '67%',
    padding: 24,
  },
  photo: {
    width: 128,
    height: 160,
    marginBottom: 24,
    alignSelf: 'center',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2563eb',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: 8,
    fontSize: 9,
  },
  contactText: {
    flex: 1,
  },
  skillItem: {
    marginBottom: 12,
  },
  skillName: {
    fontSize: 9,
    marginBottom: 4,
  },
  skillBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
  },
  skillProgress: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  summary: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.6,
    marginBottom: 24,
  },
  experienceItem: {
    marginBottom: 16,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#2563eb',
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
  },
  experienceDate: {
    fontSize: 9,
    color: '#6B7280',
  },
  experienceCompany: {
    fontSize: 9,
    color: '#2563eb',
    marginBottom: 2,
  },
  experienceLocation: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 4,
  },
  experienceDescription: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.5,
  },
  educationItem: {
    marginBottom: 16,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#2563eb',
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
  },
  educationDate: {
    fontSize: 9,
    color: '#6B7280',
  },
  educationInstitution: {
    fontSize: 9,
    color: '#2563eb',
    marginBottom: 2,
  },
  educationField: {
    fontSize: 9,
    color: '#374151',
    marginBottom: 2,
  },
  educationLocation: {
    fontSize: 8,
    color: '#6B7280',
  },
});

export function ModernPDF({ data }: { data: CVData }) {
  const getSkillPercentage = (level: string) => {
    const num = parseInt(level.replace(/\D/g, ''));
    return num || 50;
  };

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.sidebar}>
          {data.personal.photoUrl && (
            <Image src={data.personal.photoUrl} style={pdfStyles.photo} />
          )}

          <Text style={pdfStyles.sectionTitle}>Persönlich</Text>
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
              <Text style={pdfStyles.contactText}>{data.personal.nationality}</Text>
            </View>
          )}

          <Text style={[pdfStyles.sectionTitle, { marginTop: 24 }]}>Kontakt</Text>
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

          {data.skills.length > 0 && (
            <>
              <Text style={[pdfStyles.sectionTitle, { marginTop: 24 }]}>
                Fähigkeiten
              </Text>
              {data.skills.map((skill) => (
                <View key={skill.id} style={pdfStyles.skillItem}>
                  <Text style={pdfStyles.skillName}>{skill.name}</Text>
                  <View style={pdfStyles.skillBar}>
                    <View
                      style={[
                        pdfStyles.skillProgress,
                        { width: `${getSkillPercentage(skill.level)}%` },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </>
          )}
        </View>

        <View style={pdfStyles.mainContent}>
          <Text style={pdfStyles.name}>
            {data.personal.firstName} {data.personal.lastName}
          </Text>

          {data.summary && (
            <>
              <Text style={pdfStyles.mainSectionTitle}>Profil</Text>
              <Text style={pdfStyles.summary}>{data.summary}</Text>
            </>
          )}

          {data.experience.length > 0 && (
            <>
              <Text style={pdfStyles.mainSectionTitle}>Berufserfahrung</Text>
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
              <Text style={pdfStyles.mainSectionTitle}>Ausbildung</Text>
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
                  </Text>
                  {edu.field && (
                    <Text style={pdfStyles.educationField}>{edu.field}</Text>
                  )}
                  {edu.location && (
                    <Text style={pdfStyles.educationLocation}>{edu.location}</Text>
                  )}
                </View>
              ))}
            </>
          )}
        </View>
      </Page>
    </Document>
  );
}
