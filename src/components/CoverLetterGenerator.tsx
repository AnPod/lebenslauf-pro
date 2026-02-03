'use client';

import { useState } from 'react';
import { CVData } from '@/types/cv';
import { FileText, Loader2, Copy, Check } from 'lucide-react';

interface CoverLetterGeneratorProps {
  cvData: CVData;
}

export default function CoverLetterGenerator({ cvData }: CoverLetterGeneratorProps) {
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateCoverLetter = async () => {
    if (!companyName || !position || !jobDescription) {
      setError('Bitte füllen Sie alle Felder aus');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          position,
          jobDescription,
          cvData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate cover letter');
      }

      const data = await response.json();
      setCoverLetter(data.coverLetter);
    } catch (err) {
      setError('Fehler beim Generieren des Anschreibens. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          KI-Anschreiben Generator
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unternehmen
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="z.B. Siemens AG"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="z.B. Softwareentwickler"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stellenbeschreibung
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Fügen Sie hier die Stellenbeschreibung ein..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            onClick={generateCoverLetter}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-md hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generiere Anschreiben...
              </>
            ) : (
              'Anschreiben generieren'
            )}
          </button>
        </div>
      </div>

      {coverLetter && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Ihr Anschreiben</h3>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  Kopiert!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Kopieren
                </>
              )}
            </button>
          </div>
          <div className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed border border-gray-200 rounded-lg p-6 bg-gray-50">
            {coverLetter}
          </div>
        </div>
      )}
    </div>
  );
}