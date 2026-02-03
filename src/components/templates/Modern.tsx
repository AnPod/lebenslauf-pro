'use client';

import { CVData } from '@/types/cv';

export function ModernPreview({ data }: { data: CVData }) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200">
      <div className="flex gap-4 mb-4">
        {data.personal.photoUrl && (
          <div className="flex-shrink-0">
            <img
              src={data.personal.photoUrl}
              alt="Profilfoto"
              className="w-20 h-24 object-cover rounded"
            />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {data.personal.firstName} {data.personal.lastName}
          </h1>
          <div className="text-sm text-gray-600 space-y-1">
            {data.personal.email && <div>{data.personal.email}</div>}
            {data.personal.phone && <div>{data.personal.phone}</div>}
            {(data.personal.city || data.personal.postalCode) && (
              <div>
                {data.personal.postalCode} {data.personal.city}
              </div>
            )}
          </div>
        </div>
      </div>

      {data.summary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold text-blue-600 mb-1 uppercase tracking-wide">
            Profil
          </h2>
          <p className="text-sm text-gray-700">{data.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">
            Berufserfahrung
          </h2>
          <div className="space-y-2">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {exp.position}
                    </h3>
                    <p className="text-gray-700 text-sm">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-600">
                    {formatDate(exp.startDate)} –{' '}
                    {exp.current ? 'heute' : formatDate(exp.endDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">
            Ausbildung
          </h2>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {edu.degree}
                    </h3>
                    <p className="text-gray-700 text-sm">{edu.institution}</p>
                  </div>
                  <span className="text-xs text-gray-600">
                    {formatDate(edu.startDate)} –{' '}
                    {edu.current ? 'heute' : formatDate(edu.endDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.skills.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">
            Fähigkeiten
          </h2>
          <div className="grid grid-cols-2 gap-1">
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

export function ModernPDF({ data }: { data: CVData }) {
  return null;
}
