'use client';

import { useState, useRef } from 'react';
import { CVData, PersonalInfo, Experience, Education, Skill } from '@/types/cv';
import { 
  Plus, Trash2, Upload, User, Briefcase, GraduationCap, 
  Wrench, FileText, ChevronDown, ChevronUp, MapPin, 
  Mail, Phone, Calendar, Globe
} from 'lucide-react';

interface CVFormProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, icon, children, defaultOpen = true }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
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
    <div className="space-y-6">
      {/* Personal Information */}
      <CollapsibleSection title="Persönliche Daten" icon={<User className="w-5 h-5 text-primary" />}>
        <div className="space-y-6">
          {/* Photo Upload */}
          <div className="flex items-start gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all bg-gray-50"
            >
              {data.personal.photoUrl ? (
                <img
                  src={data.personal.photoUrl}
                  alt="Profilfoto"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500 text-center">Foto<br/>hochladen</span>
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
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">Passfoto</p>
              <p className="text-xs text-gray-500">Ein professionelles Foto für Ihren deutschen Lebenslauf. Wird in der oberen rechten Ecke platziert.</p>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vorname</label>
              <input
                type="text"
                value={data.personal.firstName}
                onChange={(e) => handlePersonalChange('firstName', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Max"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nachname</label>
              <input
                type="text"
                value={data.personal.lastName}
                onChange={(e) => handlePersonalChange('lastName', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Mustermann"
              />
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                E-Mail
              </label>
              <input
                type="email"
                value={data.personal.email}
                onChange={(e) => handlePersonalChange('email', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="max.mustermann@email.de"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                Telefon
              </label>
              <input
                type="tel"
                value={data.personal.phone}
                onChange={(e) => handlePersonalChange('phone', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="+49 123 4567890"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              Adresse
            </label>
            <input
              type="text"
              value={data.personal.address}
              onChange={(e) => handlePersonalChange('address', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all mb-3"
              placeholder="Musterstraße 123"
            />
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                value={data.personal.postalCode}
                onChange={(e) => handlePersonalChange('postalCode', e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="10115"
              />
              <input
                type="text"
                value={data.personal.city}
                onChange={(e) => handlePersonalChange('city', e.target.value)}
                className="col-span-2 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Berlin"
              />
            </div>
          </div>

          {/* Birth Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Geburtsdatum
              </label>
              <input
                type="date"
                value={data.personal.dateOfBirth}
                onChange={(e) => handlePersonalChange('dateOfBirth', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Geburtsort</label>
              <input
                type="text"
                value={data.personal.placeOfBirth}
                onChange={(e) => handlePersonalChange('placeOfBirth', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="München"
              />
            </div>
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400" />
              Staatsangehörigkeit
            </label>
            <input
              type="text"
              value={data.personal.nationality}
              onChange={(e) => handlePersonalChange('nationality', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Deutsch"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Profile/Summary */}
      <CollapsibleSection title="Profil / Zusammenfassung" icon={<FileText className="w-5 h-5 text-primary" />}>
        <div>
          <p className="text-sm text-gray-500 mb-3">Eine kurze Zusammenfassung Ihrer Qualifikationen und Karriereziele. Dieser Abschnitt erscheint direkt unter Ihren persönlichen Daten.</p>
          <textarea
            value={data.summary}
            onChange={(e) => onChange({ ...data, summary: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
            placeholder="Erfahrener Softwareentwickler mit 5+ Jahren Erfahrung in der Entwicklung skalierbarer Webanwendungen..."
          />
        </div>
      </CollapsibleSection>

      {/* Experience */}
      <CollapsibleSection title="Berufserfahrung" icon={<Briefcase className="w-5 h-5 text-primary" />}>
        <div className="space-y-4">
          {data.experience.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">Noch keine Einträge. Fügen Sie Ihre erste Position hinzu.</p>
          )}
          {data.experience.map((exp, index) => (
            <div key={exp.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Position {index + 1}</span>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Unternehmen"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Ort"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <span className="text-gray-400">bis</span>
                  {!exp.current ? (
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <span className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">heute</span>
                  )}
                </div>
              </div>
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Aktuelle Position</span>
              </label>
              <textarea
                placeholder="Aufgaben und Verantwortlichkeiten..."
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={3}
              />
            </div>
          ))}
          <button
            onClick={addExperience}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Position hinzufügen
          </button>
        </div>
      </CollapsibleSection>

      {/* Education */}
      <CollapsibleSection title="Ausbildung" icon={<GraduationCap className="w-5 h-5 text-primary" />}>
        <div className="space-y-4">
          {data.education.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">Noch keine Einträge. Fügen Sie Ihre erste Ausbildung hinzu.</p>
          )}
          {data.education.map((edu, index) => (
            <div key={edu.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Ausbildung {index + 1}</span>
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Institution / Universität"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Abschluss (z.B. Bachelor)"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Studienfach"
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Ort"
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <span className="text-gray-400">bis</span>
                {!edu.current ? (
                  <input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                ) : (
                  <span className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">heute</span>
                )}
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={edu.current}
                  onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Aktuell</span>
              </label>
            </div>
          ))}
          <button
            onClick={addEducation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Ausbildung hinzufügen
          </button>
        </div>
      </CollapsibleSection>

      {/* Skills */}
      <CollapsibleSection title="Fähigkeiten" icon={<Wrench className="w-5 h-5 text-primary" />}>
        <div className="space-y-3">
          {data.skills.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">Noch keine Fähigkeiten. Fügen Sie Ihre ersten Fähigkeiten hinzu.</p>
          )}
          {data.skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
              <input
                type="text"
                placeholder="Fähigkeit (z.B. Deutsch, Python)"
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <select
                value={skill.level}
                onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-40"
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-32"
              >
                <option value="technical">Technisch</option>
                <option value="language">Sprache</option>
                <option value="soft">Soft Skills</option>
              </select>
              <button
                onClick={() => removeSkill(skill.id)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addSkill}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Fähigkeit hinzufügen
          </button>
        </div>
      </CollapsibleSection>
    </div>
  );
}