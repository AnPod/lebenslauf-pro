'use client';

import { useState } from 'react';
import { CVData } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Loader2, Copy, Check, Sparkles } from 'lucide-react';

interface CoverLetterGeneratorProps {
  cvData: CVData;
}

export function CoverLetterGenerator({ cvData }: CoverLetterGeneratorProps) {
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState<'Professional' | 'Formal' | 'Enthusiastic' | 'Concise'>('Professional');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);

  const generateCoverLetter = async () => {
    if (!companyName || !position || !jobDescription) {
      setError('Bitte füllen Sie alle Felder aus');
      return;
    }

    if (!consent) {
      setError('Bitte stimmen Sie der Datenverarbeitung zu');
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
          tone,
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
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>KI-Anschreiben Generator</CardTitle>
              <p className="text-sm text-muted-foreground">
                Generieren Sie ein maßgeschneidertes Anschreiben basierend auf Ihrem Lebenslauf
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Unternehmen</Label>
              <Input
                id="company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="z.B. Siemens AG"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="z.B. Softwareentwickler"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Ton</Label>
            <Select value={tone} onValueChange={(value: 'Professional' | 'Formal' | 'Enthusiastic' | 'Concise') => setTone(value)}>
              <SelectTrigger id="tone">
                <SelectValue placeholder="Wählen Sie einen Ton" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Professional">Professionell</SelectItem>
                <SelectItem value="Formal">Formell</SelectItem>
                <SelectItem value="Enthusiastic">Begeistert</SelectItem>
                <SelectItem value="Concise">Prägnant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobDescription">Stellenbeschreibung</Label>
            <Textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Fügen Sie hier die Stellenbeschreibung ein..."
              rows={6}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex items-start space-x-2 rounded-lg border p-3 bg-muted/50">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Ich stimme zu, dass meine Daten zur Generierung des Anschreibens verarbeitet werden
              </label>
              <p className="text-xs text-muted-foreground">
                Ihre persönlichen Daten werden nur zur Generierung des Anschreibens verwendet und nicht gespeichert.
              </p>
            </div>
          </div>

          <Button
            onClick={generateCoverLetter}
            disabled={loading || !consent}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generiere Anschreiben...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Anschreiben generieren
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {coverLetter && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Ihr Anschreiben</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Basierend auf Ihrem Lebenslauf und der Stellenbeschreibung
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Kopiert!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Kopieren
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed bg-muted/50 rounded-lg p-6 border">
              {coverLetter}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}