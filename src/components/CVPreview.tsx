'use client';

import { CVData } from '@/types/cv';
import { Download } from 'lucide-react';

interface CVPreviewProps {
  data: CVData;
}

export default function CVPreview({ data }: CVPreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation with react-pdf
    alert('PDF Export kommt bald!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
        >
          <Download className="w-4 h-4" />
          Als PDF herunterladen
        </button>
      </div>

      {/* A4 Preview */}
      <div className="bg-white shadow-lg mx-auto" style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}>
        {/* Header with Photo */}
        <div className="flex gap-8 mb-8">
          {data.personal.photoUrl && (
            <div className="flex-shrink-0">
              <img
                src={data.personal.photoUrl}
                alt="Profilfoto"
                className="w-32 h-40 object-cover rounded-sm"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {data.personal.firstName} {data.personal.lastName}
            </h1>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              {data.personal.email && (
                <div><span className="font-medium">E-Mail:</span> {data.personal.email}</div>
              )}
              {data.personal.phone && (
                <div><span className="font-medium">Telefon:</span> {data.personal.phone}</div>
              )}
              {(data.personal.address || data.personal.city) && (
                <div className="col-span-2">
                  <span className="font-medium">Adresse:</span>{' '}
                  {data.personal.address}, {data.personal.postalCode} {data.personal.city}
                </div>
              )}
              {data.personal.dateOfBirth && (
                <div>
                  <span className="font-medium">Geburtsdatum:</span>{' '}
                  {new Date(data.personal.dateOfBirth).toLocaleDateString('de-DE')}
                  {data.personal.placeOfBirth && ` in ${data.personal.placeOfBirth}`}
                </div>
              )}
              {data.personal.nationality && (
                <div><span className="font-medium">Staatsangehörigkeit:</span> {data.personal.nationality}</div>
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        {data.summary && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-800 pb-1 mb-3">
              Profil
            </h2>
            <p className="text-gray-700 leading-relaxed">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-800 pb-1 mb-3">
              Berufserfahrung
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-gray-700">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-600 text-right">
                      {formatDate(exp.startDate)} – {exp.current ? 'heute' : formatDate(exp.endDate)}
                      <br />
                      {exp.location}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 mt-2 text-sm leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-800 pb-1 mb-3">
              Ausbildung
            </h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                      <p className="text-gray-700">{edu.institution}</p>
                    </div>
                    <span className="text-sm text-gray-600 text-right">
                      {formatDate(edu.startDate)} – {edu.current ? 'heute' : formatDate(edu.endDate)}
                      <br />
                      {edu.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-800 pb-1 mb-3">
              Fähigkeiten
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.skills.map((skill) => (
                <div key={skill.id} className="flex justify-between">
                  <span className="text-gray-700">{skill.name}</span>
                  <span className="text-gray-600 text-sm">{skill.level}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GDPR Footer */}
        <footer className="mt-12 pt-4 border-t border-gray-300 text-xs text-gray-500">
          <p>
            Ich bin damit einverstanden, dass meine persönlichen Daten für die Dauer des
            Bewerbungsverfahrens verarbeitet werden.
          </p>
        </footer>
      </div>
    </div>
  );
}