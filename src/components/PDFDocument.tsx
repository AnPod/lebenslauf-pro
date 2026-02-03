import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import { CVData } from '@/types/cv';
import { formatDateGerman } from '@/lib/pdf';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  photo: {
    width: 100,
    height: 130,
    marginRight: 20,
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
  },
  contactInfo: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
  },
  contactLabel: {
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
    borderBottomWidth: 2,
    borderBottomColor: '#1F2937',
    paddingBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summary: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.6,
  },
  experienceItem: {
    marginBottom: 10,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  experienceTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  experienceCompany: {
    fontSize: 10,
    color: '#374151',
  },
  experienceDate: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'right',
  },
  experienceLocation: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'right',
  },
  experienceDescription: {
    fontSize: 9,
    color: '#374151',
    marginTop: 2,
    lineHeight: 1.5,
  },
  educationItem: {
    marginBottom: 10,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  educationDegree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  educationInstitution: {
    fontSize: 10,
    color: '#374151',
  },
  educationDate: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'right',
  },
  educationLocation: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'right',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  skillName: {
    fontSize: 10,
    color: '#374151',
  },
  skillLevel: {
    fontSize: 10,
    color: '#6B7280',
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
  },
  footerText: {
    fontSize: 8,
    color: '#6B7280',
    textAlign: 'center',
  },
});

interface PDFDocumentProps {
  data: CVData;
}

export function PDFDocument({ data }: PDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {data.personal.photoUrl && (
            <Image src={data.personal.photoUrl} style={styles.photo} />
          )}
          <View style={styles.headerContent}>
            <Text style={styles.name}>
              {data.personal.firstName} {data.personal.lastName}
            </Text>
            <View style={styles.contactInfo}>
              {data.personal.email && (
                <Text>
                  <Text style={styles.contactLabel}>E-Mail:</Text>{' '}
                  {data.personal.email}
                </Text>
              )}
              {data.personal.phone && (
                <Text>
                  <Text style={styles.contactLabel}>Telefon:</Text>{' '}
                  {data.personal.phone}
                </Text>
              )}
              {(data.personal.address || data.personal.city) && (
                <Text>
                  <Text style={styles.contactLabel}>Adresse:</Text>{' '}
                  {data.personal.address}, {data.personal.postalCode}{' '}
                  {data.personal.city}
                </Text>
              )}
              {data.personal.dateOfBirth && (
                <Text>
                  <Text style={styles.contactLabel}>Geburtsdatum:</Text>{' '}
                  {new Date(data.personal.dateOfBirth).toLocaleDateString('de-DE')}
                  {data.personal.placeOfBirth &&
                    ` in ${data.personal.placeOfBirth}`}
                </Text>
              )}
              {data.personal.nationality && (
                <Text>
                  <Text style={styles.contactLabel}>Staatsangehörigkeit:</Text>{' '}
                  {data.personal.nationality}
                </Text>
              )}
            </View>
          </View>
        </View>

        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profil</Text>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}

        {data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Berufserfahrung</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <View>
                    <Text style={styles.experienceTitle}>{exp.position}</Text>
                    <Text style={styles.experienceCompany}>{exp.company}</Text>
                  </View>
                  <View>
                    <Text style={styles.experienceDate}>
                      {formatDateGerman(exp.startDate)} –{' '}
                      {exp.current ? 'heute' : formatDateGerman(exp.endDate)}
                    </Text>
                    <Text style={styles.experienceLocation}>{exp.location}</Text>
                  </View>
                </View>
                {exp.description && (
                  <Text style={styles.experienceDescription}>
                    {exp.description}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ausbildung</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={styles.educationItem}>
                <View style={styles.educationHeader}>
                  <View>
                    <Text style={styles.educationDegree}>
                      {edu.degree} in {edu.field}
                    </Text>
                    <Text style={styles.educationInstitution}>
                      {edu.institution}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.educationDate}>
                      {formatDateGerman(edu.startDate)} –{' '}
                      {edu.current ? 'heute' : formatDateGerman(edu.endDate)}
                    </Text>
                    <Text style={styles.educationLocation}>{edu.location}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fähigkeiten</Text>
            <View style={styles.skillsGrid}>
              {data.skills.map((skill) => (
                <View key={skill.id} style={styles.skillItem}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={styles.skillLevel}>{skill.level}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Ich bin damit einverstanden, dass meine persönlichen Daten für die
            Dauer des Bewerbungsverfahrens verarbeitet werden.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
