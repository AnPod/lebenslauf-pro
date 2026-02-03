'use client';

import { useRef } from 'react';
import { CVData, PersonalInfo, Experience, Education, Skill } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, Briefcase, GraduationCap, Wrench, FileText, 
  Plus, Trash2, Upload, MapPin, Mail, Phone, Calendar, Globe 
} from 'lucide-react';

interface CVFormProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

export function CVForm({ data, onChange }: CVFormProps) {
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
    <Accordion type="multiple" defaultValue={['personal']} className="space-y-4">
      {/* Personal Information */}
      <AccordionItem value="personal" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <CardTitle className="text-base">Persönliche Daten</CardTitle>
              <p className="text-sm text-muted-foreground">Name, Kontakt, Adresse</p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="space-y-4">
            {/* Photo Upload */}
            <div className="flex items-start gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all bg-muted/50"
              >
                {data.personal.photoUrl ? (
                  <img
                    src={data.personal.photoUrl}
                    alt="Profilfoto"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground text-center">Foto<br/>hochladen</span>
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
                <Label className="text-sm font-medium">Passfoto</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Ein professionelles Foto für Ihren deutschen Lebenslauf.
                </p>
              </div>
            </div>

            <Separator />

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname</Label>
                <Input
                  id="firstName"
                  value={data.personal.firstName}
                  onChange={(e) => handlePersonalChange('firstName', e.target.value)}
                  placeholder="Max"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname</Label>
                <Input
                  id="lastName"
                  value={data.personal.lastName}
                  onChange={(e) => handlePersonalChange('lastName', e.target.value)}
                  placeholder="Mustermann"
                />
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  E-Mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={data.personal.email}
                  onChange={(e) => handlePersonalChange('email', e.target.value)}
                  placeholder="max.mustermann@email.de"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Telefon
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={data.personal.phone}
                  onChange={(e) => handlePersonalChange('phone', e.target.value)}
                  placeholder="+49 123 4567890"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Adresse
              </Label>
              <Input
                id="address"
                value={data.personal.address}
                onChange={(e) => handlePersonalChange('address', e.target.value)}
                placeholder="Musterstraße 123"
                className="mb-2"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Input
                  value={data.personal.postalCode}
                  onChange={(e) => handlePersonalChange('postalCode', e.target.value)}
                  placeholder="10115"
                />
                <Input
                  className="col-span-1 sm:col-span-2"
                  value={data.personal.city}
                  onChange={(e) => handlePersonalChange('city', e.target.value)}
                  placeholder="Berlin"
                />
              </div>
            </div>

            {/* Birth Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Geburtsdatum
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={data.personal.dateOfBirth}
                  onChange={(e) => handlePersonalChange('dateOfBirth', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="placeOfBirth">Geburtsort</Label>
                <Input
                  id="placeOfBirth"
                  value={data.personal.placeOfBirth}
                  onChange={(e) => handlePersonalChange('placeOfBirth', e.target.value)}
                  placeholder="München"
                />
              </div>
            </div>

            {/* Nationality */}
            <div className="space-y-2">
              <Label htmlFor="nationality" className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                Staatsangehörigkeit
              </Label>
              <Input
                id="nationality"
                value={data.personal.nationality}
                onChange={(e) => handlePersonalChange('nationality', e.target.value)}
                placeholder="Deutsch"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Profile/Summary */}
      <AccordionItem value="summary" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <CardTitle className="text-base">Profil / Zusammenfassung</CardTitle>
              <p className="text-sm text-muted-foreground">Kurze Vorstellung</p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Eine kurze Zusammenfassung Ihrer Qualifikationen und Karriereziele.
            </p>
            <Textarea
              value={data.summary}
              onChange={(e) => onChange({ ...data, summary: e.target.value })}
              placeholder="Erfahrener Softwareentwickler mit 5+ Jahren Erfahrung..."
              rows={4}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Experience */}
      <AccordionItem value="experience" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <CardTitle className="text-base">Berufserfahrung</CardTitle>
              <p className="text-sm text-muted-foreground">
                {data.experience.length} Position{data.experience.length !== 1 ? 'en' : ''}
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="space-y-4">
            {data.experience.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Noch keine Einträge. Fügen Sie Ihre erste Position hinzu.
              </p>
            )}
            {data.experience.map((exp, index) => (
              <Card key={exp.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">Position {index + 1}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExperience(exp.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Unternehmen</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        placeholder="Unternehmen"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                        placeholder="Position"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ort</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        placeholder="Ort"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Zeitraum</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          className="flex-1"
                        />
                        <span className="text-muted-foreground">bis</span>
                        {!exp.current ? (
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            className="flex-1"
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground px-2">heute</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`current-${exp.id}`}
                      checked={exp.current}
                      onCheckedChange={(checked) => updateExperience(exp.id, 'current', checked)}
                    />
                    <Label htmlFor={`current-${exp.id}`} className="text-sm">Aktuelle Position</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>Beschreibung</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      placeholder="Aufgaben und Verantwortlichkeiten..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              variant="outline"
              onClick={addExperience}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Position hinzufügen
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Education */}
      <AccordionItem value="education" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <CardTitle className="text-base">Ausbildung</CardTitle>
              <p className="text-sm text-muted-foreground">
                {data.education.length} Eintrag{data.education.length !== 1 ? 'e' : ''}
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="space-y-4">
            {data.education.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Noch keine Einträge. Fügen Sie Ihre erste Ausbildung hinzu.
              </p>
            )}
            {data.education.map((edu, index) => (
              <Card key={edu.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">Ausbildung {index + 1}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEducation(edu.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        placeholder="Universität / Schule"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Abschluss</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="Bachelor, Master, etc."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Studienfach</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                        placeholder="Fachrichtung"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ort</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                        placeholder="Ort"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Zeitraum</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-muted-foreground">bis</span>
                      {!edu.current ? (
                        <Input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          className="flex-1"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground px-2">heute</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`edu-current-${edu.id}`}
                      checked={edu.current}
                      onCheckedChange={(checked) => updateEducation(edu.id, 'current', checked)}
                    />
                    <Label htmlFor={`edu-current-${edu.id}`} className="text-sm">Aktuell</Label>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              variant="outline"
              onClick={addEducation}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ausbildung hinzufügen
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Skills */}
      <AccordionItem value="skills" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <CardTitle className="text-base">Fähigkeiten</CardTitle>
              <p className="text-sm text-muted-foreground">
                {data.skills.length} Fähigkeit{data.skills.length !== 1 ? 'en' : ''}
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="space-y-3">
            {data.skills.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Noch keine Fähigkeiten. Fügen Sie Ihre ersten Fähigkeiten hinzu.
              </p>
            )}
            {data.skills.map((skill) => (
              <Card key={skill.id} className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Input
                    placeholder="Fähigkeit (z.B. Deutsch, Python)"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={skill.level}
                      onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                      className="flex-1 sm:w-32 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      {skill.category === 'language' ? (
                        <>
                          <option value="A1">A1</option>
                          <option value="A2">A2</option>
                          <option value="B1">B1</option>
                          <option value="B2">B2</option>
                          <option value="C1">C1</option>
                          <option value="C2">C2</option>
                        </>
                      ) : (
                        <>
                          <option value="Grundkenntnisse">Grundkenntnisse</option>
                          <option value="Gut">Gut</option>
                          <option value="Sehr gut">Sehr gut</option>
                          <option value="Fließend">Fließend</option>
                        </>
                      )}
                    </select>
                    <select
                      value={skill.category}
                      onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                      className="w-28 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="technical">Technisch</option>
                      <option value="language">Sprache</option>
                      <option value="soft">Soft Skills</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSkill(skill.id)}
                      className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            <Button
              variant="outline"
              onClick={addSkill}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Fähigkeit hinzufügen
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}