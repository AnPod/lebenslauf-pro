'use client';

import { useState, useRef } from 'react';
import { CVData, PersonalInfo, Experience, Education, Skill } from '@/types/cv';
import { Plus, Trash2, Upload } from 'lucide-react';

interface CVFormProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

export default function CVForm({ data, onChange }: CVFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePersonalChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      personal: { ...data.personal, [field]: value },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handlePersonalChange('photoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    onChange({ ...data, experience: [...data.experience, newExp] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange({
      ...data,
      experience: data.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter((exp) => exp.id !== id),
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    onChange({
      ...data,
      education: data.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((edu) => edu.id !== id),
    });
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'Gut',
      category: 'technical',
    };
    onChange({ ...data, skills: [...data.skills, newSkill] });
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    onChange({
      ...data,
      skills: data.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });
  };

  const removeSkill = (id: string) => {
    onChange({
      ...data,
      skills: data.skills.filter((skill) => skill.id !== id),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Personal Information */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-primary mb-4">Persönliche Daten</h2>
        
        {/* Photo Upload */}
        <div className="mb-6 flex items-center gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-gray-50"
          >
            {data.personal.photoUrl ? (
              <img
                src={data.personal.photoUrl}
                alt="Profilfoto"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500 text-center">Foto hochladen</span>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <div className="text-sm text-gray-600">
            <p className="font-medium">Passfoto (empfohlen)</p>
            <p>Professionelles Foto für den deutschen Lebenslauf</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vorname</label>
            <input
              type="text"
              value={data.personal.firstName}
              onChange={(e) => handlePersonalChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nachname</label>
            <input
              type="text"
              value={data.personal.lastName}
              onChange={(e) => handlePersonalChange('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
            <input
              type="email"
              value={data.personal.email}
              onChange={(e) => handlePersonalChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input
              type="tel"
              value={data.personal.phone}
              onChange={(e) => handlePersonalChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="+49 123 4567890"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Straße und Hausnummer</label>
            <input
              type="text"
              value={data.personal.address}
              onChange={(e) => handlePersonalChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PLZ</label>
            <input
              type="text"
              value={data.personal.postalCode}
              onChange={(e) => handlePersonalChange('postalCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ort</label>
            <input
              type="text"
              value={data.personal.city}
              onChange={(e) => handlePersonalChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Geburtsdatum</label>
            <input
              type="date"
              value={data.personal.dateOfBirth}
              onChange={(e) => handlePersonalChange('dateOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Geburtsort</label>
            <input
              type="text"
              value={data.personal.placeOfBirth}
              onChange={(e) => handlePersonalChange('placeOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Staatsangehörigkeit</label>
            <input
              type="text"
              value={data.personal.nationality}
              onChange={(e) => handlePersonalChange('nationality', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-primary mb-4">Profil / Zusammenfassung</h2>
        <textarea
          value={data.summary}
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Kurze Zusammenfassung Ihrer Qualifikationen und Ziele..."
        />
      </section>

      {/* Experience */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Berufserfahrung</h2>
          <button
            onClick={addExperience}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
          >
            <Plus className="w-4 h-4" />
            Hinzufügen
          </button>
        </div>
        <div className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Unternehmen"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Ort"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md flex-1"
                  />
                  <span>bis</span>
                  {!exp.current ? (
                    <input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md flex-1"
                    />
                  ) : (
                    <span className="px-3 py-2 text-sm text-gray-600">heute</span>
                  )}
                </div>
                <label className="flex items-center gap-2 col-span-2">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">Aktuelle Position</span>
                </label>
                <textarea
                  placeholder="Aufgaben und Verantwortlichkeiten..."
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <button
                onClick={() => removeExperience(exp.id)}
                className="mt-4 flex items-center gap-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
                Löschen
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Ausbildung</h2>
          <button
            onClick={addEducation}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
          >
            <Plus className="w-4 h-4" />
            Hinzufügen
          </button>
        </div>
        <div className="space-y-4">
          {data.education.map((edu) => (
            <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Institution / Universität"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Abschluss (z.B. Bachelor, Master)"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Studienfach"
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Ort"
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <div className="flex items-center gap-2 col-span-2">
                  <input
                    type="date"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md flex-1"
                  />
                  <span>bis</span>
                  {!edu.current ? (
                    <input
                      type="date"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md flex-1"
                    />
                  ) : (
                    <span className="px-3 py-2 text-sm text-gray-600">heute</span>
                  )}
                </div>
                <label className="flex items-center gap-2 col-span-2">
                  <input
                    type="checkbox"
                    checked={edu.current}
                    onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">Aktuell</span>
                </label>
              </div>
              <button
                onClick={() => removeEducation(edu.id)}
                className="mt-4 flex items-center gap-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
                Löschen
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Fähigkeiten</h2>
          <button
            onClick={addSkill}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
          >
            <Plus className="w-4 h-4" />
            Hinzufügen
          </button>
        </div>
        <div className="space-y-3">
          {data.skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Fähigkeit (z.B. Deutsch, Python, Projektmanagement)"
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <select
                value={skill.level}
                onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {skill.category === 'language' ? (
                  <>
                    <option value="A1">A1 - Anfänger</option>
                    <option value="A2">A2 - Grundlegend</option>
                    <option value="B1">B1 - Mittelstufe</option>
                    <option value="B2">B2 - Gute Mittelstufe</option>
                    <option value="C1">C1 - Fortgeschritten</option>
                    <option value="C2">C2 - Fließend</option>
                  </>
                ) : (
                  <>
                    <option value="Grundkenntnisse">Grundkenntnisse</option>
                    <option value="Gut">Gut</option>
                    <option value="Sehr gut">Sehr gut</option>
                    <option value="Fließend">Fließend / Experte</option>
                  </>
                )}
              </select>
              <select
                value={skill.category}
                onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="technical">Technisch</option>
                <option value="language">Sprache</option>
                <option value="soft">Soft Skills</option>
              </select>
              <button
                onClick={() => removeSkill(skill.id)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}