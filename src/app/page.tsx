'use client';

import { useState, useEffect, useRef } from 'react';
import { CVData } from '@/types/cv';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Sparkles, Save, Menu, X, Download, Upload } from 'lucide-react';
import { CVForm } from '@/components/CVForm';
import { CVPreview } from '@/components/CVPreview';
import { CoverLetterGenerator } from '@/components/CoverLetterGenerator';
import { Sidebar, Section } from '@/components/Sidebar';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { calculateProgress } from '@/lib/progress';
import { exportCVToJSON } from '@/lib/export';
import { importCVFromJSON } from '@/lib/import';

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
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('personal');
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progress = calculateProgress(cvData);

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

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('lebenslauf-data', JSON.stringify(cvData));
      setLastSaved(new Date());
    }
  }, [cvData, isClient]);

  const handleExport = () => {
    try {
      exportCVToJSON(cvData);
      setImportMessage({ type: 'success', text: 'CV erfolgreich exportiert!' });
      setTimeout(() => setImportMessage(null), 3000);
    } catch (error) {
      setImportMessage({ type: 'error', text: 'Export fehlgeschlagen.' });
      setTimeout(() => setImportMessage(null), 3000);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await importCVFromJSON(file);

    if (result.success && result.data) {
      setCVData(result.data);
      setImportMessage({ type: 'success', text: 'CV erfolgreich importiert!' });
      setTimeout(() => setImportMessage(null), 3000);
    } else {
      setImportMessage({ type: 'error', text: result.error || 'Import fehlgeschlagen.' });
      setTimeout(() => setImportMessage(null), 5000);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold hidden sm:inline">Lebenslauf Pro</span>
          </div>

          <div className="flex items-center gap-2">
            {lastSaved && (
              <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
                <Save className="h-3 w-3" />
                <span className="text-xs">
                  {lastSaved.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </Badge>
            )}

            <Button variant="outline" size="sm" onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>

            <Button variant="outline" size="sm" onClick={handleImportClick} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />

            {importMessage && (
              <Badge variant={importMessage.type === 'success' ? 'default' : 'destructive'} className="flex">
                {importMessage.text}
              </Badge>
            )}

            {/* Mobile Preview Toggle */}
            <Sheet open={mobilePreviewOpen} onOpenChange={setMobilePreviewOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Menu className="h-4 w-4 mr-2" />
                  Vorschau
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-0">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <CVPreview data={cvData} />
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-4 sm:py-6">
        <Tabs defaultValue="editor" className="space-y-4">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="editor" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Lebenslauf</span>
              <span className="sm:hidden">CV</span>
            </TabsTrigger>
            <TabsTrigger value="coverletter" className="gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Anschreiben</span>
              <span className="sm:hidden">KI</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_1fr] gap-4 lg:gap-6">
              <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} progress={progress} />

              <Card className="p-4 sm:p-6">
                <CVForm data={cvData} onChange={setCVData} />
              </Card>

              <div className="hidden lg:block">
                <Card className="p-4 sticky top-20">
                  <ScrollArea className="h-[calc(100vh-180px)]">
                    <CVPreview data={cvData} />
                  </ScrollArea>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="coverletter">
            <CoverLetterGenerator cvData={cvData} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}