'use client';

import { useState, useEffect } from 'react';
import CVForm from '@/components/CVForm';
import CVPreview from '@/components/CVPreview';
import CoverLetterGenerator from '@/components/CoverLetterGenerator';
import { CVData } from '@/types/cv';
import { Save, Check, FileText, PenTool, Sparkles } from 'lucide-react';

const defaultCVData: CVData = {
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: '',
  },
  experience: [],
  education: [],
  skills: [],
  summary: '',
};

export default function Home() {
  const [cvData, setCVData] = useState<CVData>(defaultCVData);
  const [activeTab, setActiveTab] = useState<'editor' | 'coverletter'>('editor');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('lebenslauf-data');
    if (saved) {
      try {
        setCVData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved data');
      }
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('lebenslauf-data', JSON.stringify(cvData));
      setLastSaved(new Date());
    }
  }, [cvData, isClient]);

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Lebenslauf Pro</h1>
                <p className="text-xs text-gray-500">Professioneller Lebenslauf Generator</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'editor'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <PenTool className="w-4 h-4" />
                Editor
              </button>
              <button
                onClick={() => setActiveTab('coverletter')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'coverletter'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                KI-Anschreiben
              </button>
            </nav>

            {/* Save Status */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {lastSaved && (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Gespeichert {lastSaved.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto">
        {activeTab === 'editor' ? (
          <div className="flex h-[calc(100vh-64px)]">
            {/* Left Panel - Form */}
            <div className="w-1/2 overflow-y-auto border-r border-gray-200 bg-white">
              <div className="p-6">
                <CVForm data={cvData} onChange={setCVData} />
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-1/2 overflow-y-auto bg-gray-100">
              <div className="p-6">
                <div className="sticky top-0 z-10 bg-gray-100 pb-4">
                  <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Live-Vorschau</h2>
                </div>
                <CVPreview data={cvData} />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <CoverLetterGenerator cvData={cvData} />
          </div>
        )}
      </main>
    </div>
  );
}