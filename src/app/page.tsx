'use client';

import { useState } from 'react';
import CVForm from '@/components/CVForm';
import CVPreview from '@/components/CVPreview';
import { CVData } from '@/types/cv';

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
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Lebenslauf Pro</h1>
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 rounded ${
                activeTab === 'editor' ? 'bg-white text-primary' : 'text-white'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded ${
                activeTab === 'preview' ? 'bg-white text-primary' : 'text-white'
              }`}
            >
              Vorschau
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'editor' ? (
          <CVForm data={cvData} onChange={setCVData} />
        ) : (
          <CVPreview data={cvData} />
        )}
      </main>
    </div>
  );
}