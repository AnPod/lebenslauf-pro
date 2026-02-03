'use client';

import { CVData } from '@/types/cv';

export function ClassicPreview({ data }: { data: CVData }) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200 font-serif">
      <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.personal.firstName} {data.personal.lastName}
        </h1>
        <div className="text-sm text-gray-700 space-y-1">
          {data.personal.email && <div>{data.personal.email}</div>}
          {data.personal.phone && <div>{data.personal.phone}</div>}
          {(data.personal.address || data.personal.city) && (
            <div>
              {data.personal.address}, {data.personal.postalCode} {data.personal.city}
            </div>
          )}
        </div>
      </div>

      {data.summary && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-400 pb-1 mb-2 uppercase">
            Profil
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-400 pb-1 mb-3 uppercase">
            Berufserfahrung
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{exp.position}</h3>
                    <p className="text-gray-700 text-sm italic">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-600 text-right">
                    {formatDate(exp.startDate)} – {exp.current ? 'heute' : formatDate(exp.endDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-400 pb-1 mb-3 uppercase">
            Ausbildung
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{edu.degree}</h3>
                    <p className="text-gray-700 text-sm italic">{edu.institution}</p>
                  </div>
                  <span className="text-xs text-gray-600 text-right">
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
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-400 pb-1 mb-3 uppercase">
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

export function ClassicPDF({ data }: { data: CVData }) {
  return null;
}
