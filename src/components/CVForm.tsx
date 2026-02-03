'use client';

import { useRef, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CVData, PersonalInfo, Experience, Education, Skill } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FormError } from '@/components/FormError';
import { SortableItem } from '@/components/SortableItem';
import {
  User, Briefcase, GraduationCap, Wrench, FileText,
  Plus, Trash2, Upload, MapPin, Mail, Phone, Calendar, Globe, CheckCircle2
} from 'lucide-react';
import { validatePersonalInfo, validateExperience, validateEducation, validateSkill, type ValidationError } from '@/lib/validation';

interface CVFormProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

export function CVForm({ data, onChange }: CVFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleExperienceDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.experience.findIndex((exp) => exp.id === active.id);
      const newIndex = data.experience.findIndex((exp) => exp.id === over.id);

      onChange({
        ...data,
        experience: arrayMove(data.experience, oldIndex, newIndex),
      });
    }
  };

  const handleEducationDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.education.findIndex((edu) => edu.id === active.id);
      const newIndex = data.education.findIndex((edu) => edu.id === over.id);

      onChange({
        ...data,
        education: arrayMove(data.education, oldIndex, newIndex),
      });
    }
  };

  const handleSkillsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.skills.findIndex((skill) => skill.id === active.id);
      const newIndex = data.skills.findIndex((skill) => skill.id === over.id);

      onChange({
        ...data,
        skills: arrayMove(data.skills, oldIndex, newIndex),
      });
    }
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data.experience.length) return;

    onChange({
      ...data,
      experience: arrayMove(data.experience, index, newIndex),
    });
  };

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data.education.length) return;

    onChange({
      ...data,
      education: arrayMove(data.education, index, newIndex),
    });
  };

  const moveSkill = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data.skills.length) return;

    onChange({
      ...data,
      skills: arrayMove(data.skills, index, newIndex),
    });
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateField = (field: string, value: any, schema: any) => {
    const result = schema.safeParse(value);
    if (!result.success) {
      const error = result.error.issues.find((issue: any) =>
        issue.path.includes(field)
      );
      if (error) {
        setErrors((prev) => ({ ...prev, [field]: error.message }));
        return false;
      }
    }
    clearError(field);
    return true;
  };

  const handlePersonalChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      personal: { ...data.personal, [field]: value },
    });
  };

  const handlePersonalBlur = (field: keyof PersonalInfo) => {
    validateField(field, data.personal, validatePersonalInfo);
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

  const handleExperienceBlur = (id: string, field: keyof Experience) => {
    const exp = data.experience.find((e) => e.id === id);
    if (exp) {
      validateField(`${id}.${field}`, exp, validateExperience);
    }
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

  const handleEducationBlur = (id: string, field: keyof Education) => {
    const edu = data.education.find((e) => e.id === id);
    if (edu) {
      validateField(`${id}.${field}`, edu, validateEducation);
    }
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

  const handleSkillBlur = (id: string, field: keyof Skill) => {
    const skill = data.skills.find((s) => s.id === id);
    if (skill) {
      validateField(`${id}.${field}`, skill, validateSkill);
    }
  };

  const removeSkill = (id: string) => {
    onChange({
      ...data,
      skills: data.skills.filter((skill) => skill.id !== id),
    });
  };

  const isSectionComplete = (section: string): boolean => {
    switch (section) {
      case 'personal':
        return Boolean(data.personal.firstName && data.personal.lastName && data.personal.email);
      case 'summary':
        return data.summary.length >= 50;
      case 'experience':
        return Boolean(data.experience.length > 0 && data.experience[0].company && data.experience[0].position);
      case 'education':
        return Boolean(data.education.length > 0 && data.education[0].institution && data.education[0].degree);
      case 'skills':
        return Boolean(data.skills.length > 0 && data.skills[0].name);
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      <section id="section-personal" className="border rounded-lg px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">Persönliche Daten</CardTitle>
            <p className="text-sm text-muted-foreground">Name, Kontakt, Adresse</p>
          </div>
          {isSectionComplete('personal') && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
        </div>

        <div className="space-y-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Vorname</Label>
              <Input
                id="firstName"
                value={data.personal.firstName}
                onChange={(e) => handlePersonalChange('firstName', e.target.value)}
                onBlur={() => handlePersonalBlur('firstName')}
                placeholder="Max"
              />
              <FormError message={errors.firstName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nachname</Label>
              <Input
                id="lastName"
                value={data.personal.lastName}
                onChange={(e) => handlePersonalChange('lastName', e.target.value)}
                onBlur={() => handlePersonalBlur('lastName')}
                placeholder="Mustermann"
              />
              <FormError message={errors.lastName} />
            </div>
          </div>

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
                onBlur={() => handlePersonalBlur('email')}
                placeholder="max.mustermann@email.de"
              />
              <FormError message={errors.email} />
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
              <FormError message={errors.dateOfBirth} />
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
      </section>

      <section id="section-profile" className="border rounded-lg px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">Profil / Zusammenfassung</CardTitle>
            <p className="text-sm text-muted-foreground">Kurze Vorstellung</p>
          </div>
          {isSectionComplete('summary') && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
        </div>

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
          {data.summary.length > 0 && data.summary.length < 50 && (
            <p className="text-xs text-muted-foreground">
              Mindestens 50 Zeichen empfohlen ({data.summary.length}/50)
            </p>
          )}
        </div>
      </section>

      <section id="section-experience" className="border rounded-lg px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">Berufserfahrung</CardTitle>
            <p className="text-sm text-muted-foreground">
              {data.experience.length} Position{data.experience.length !== 1 ? 'en' : ''}
            </p>
          </div>
          {isSectionComplete('experience') && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleExperienceDragEnd}
        >
          <SortableContext
            items={data.experience.map((exp) => exp.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {data.experience.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Noch keine Einträge. Fügen Sie Ihre erste Position hinzu.
                </p>
              )}
              {data.experience.map((exp, index) => (
                <SortableItem
                  key={exp.id}
                  id={exp.id}
                  index={index}
                  total={data.experience.length}
                  onMoveUp={() => moveExperience(index, 'up')}
                  onMoveDown={() => moveExperience(index, 'down')}
                >
                  <Card className="relative">
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
                            onBlur={() => handleExperienceBlur(exp.id, 'company')}
                            placeholder="Unternehmen"
                          />
                          <FormError message={errors[`${exp.id}.company`]} />
                        </div>
                        <div className="space-y-2">
                          <Label>Position</Label>
                          <Input
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                            onBlur={() => handleExperienceBlur(exp.id, 'position')}
                            placeholder="Position"
                          />
                          <FormError message={errors[`${exp.id}.position`]} />
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
                              onBlur={() => handleExperienceBlur(exp.id, 'startDate')}
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
                          <FormError message={errors[`${exp.id}.startDate`]} />
                          <FormError message={errors[`${exp.id}.endDate`]} />
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
                </SortableItem>
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
          </SortableContext>
        </DndContext>
      </section>

      <section id="section-education" className="border rounded-lg px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">Ausbildung</CardTitle>
            <p className="text-sm text-muted-foreground">
              {data.education.length} Eintrag{data.education.length !== 1 ? 'e' : ''}
            </p>
          </div>
          {isSectionComplete('education') && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleEducationDragEnd}
        >
          <SortableContext
            items={data.education.map((edu) => edu.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {data.education.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Noch keine Einträge. Fügen Sie Ihre erste Ausbildung hinzu.
                </p>
              )}
              {data.education.map((edu, index) => (
                <SortableItem
                  key={edu.id}
                  id={edu.id}
                  index={index}
                  total={data.education.length}
                  onMoveUp={() => moveEducation(index, 'up')}
                  onMoveDown={() => moveEducation(index, 'down')}
                >
                  <Card className="relative">
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
                            onBlur={() => handleEducationBlur(edu.id, 'institution')}
                            placeholder="Universität / Schule"
                          />
                          <FormError message={errors[`${edu.id}.institution`]} />
                        </div>
                        <div className="space-y-2">
                          <Label>Abschluss</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            onBlur={() => handleEducationBlur(edu.id, 'degree')}
                            placeholder="Bachelor, Master, etc."
                          />
                          <FormError message={errors[`${edu.id}.degree`]} />
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
                            onBlur={() => handleEducationBlur(edu.id, 'startDate')}
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
                        <FormError message={errors[`${edu.id}.startDate`]} />
                        <FormError message={errors[`${edu.id}.endDate`]} />
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
                </SortableItem>
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
          </SortableContext>
        </DndContext>
      </section>

      <section id="section-skills" className="border rounded-lg px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Wrench className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">Fähigkeiten</CardTitle>
            <p className="text-sm text-muted-foreground">
              {data.skills.length} Fähigkeit{data.skills.length !== 1 ? 'en' : ''}
            </p>
          </div>
          {isSectionComplete('skills') && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSkillsDragEnd}
        >
          <SortableContext
            items={data.skills.map((skill) => skill.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {data.skills.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Noch keine Fähigkeiten. Fügen Sie Ihre ersten Fähigkeiten hinzu.
                </p>
              )}
              {data.skills.map((skill, index) => (
                <SortableItem
                  key={skill.id}
                  id={skill.id}
                  index={index}
                  total={data.skills.length}
                  onMoveUp={() => moveSkill(index, 'up')}
                  onMoveDown={() => moveSkill(index, 'down')}
                >
                  <Card className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <Input
                        placeholder="Fähigkeit (z.B. Deutsch, Python)"
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                        onBlur={() => handleSkillBlur(skill.id, 'name')}
                        className="flex-1"
                      />
                      <FormError message={errors[`${skill.id}.name`]} />
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
                </SortableItem>
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
          </SortableContext>
        </DndContext>
      </section>
    </div>
  );
}
