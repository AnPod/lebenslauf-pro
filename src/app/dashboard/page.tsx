'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles, TrendingUp, User, Plus, ArrowRight } from 'lucide-react';
import { CVData } from '@/types/cv';
import { calculateProgress } from '@/lib/progress';
import Link from 'next/link';

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [stats, setStats] = useState({
    cvsCreated: 0,
    coverLetters: 0,
    profileCompletion: 0,
  });

  useEffect(() => {
    setIsClient(true);

    const savedData = localStorage.getItem('lebenslauf-data');
    if (savedData) {
      try {
        const cvData: CVData = JSON.parse(savedData);
        const progress = calculateProgress(cvData);

        const hasCVData = cvData.personal.firstName || cvData.personal.lastName || cvData.experience.length > 0;

        const coverLettersData = localStorage.getItem('lebenslauf-coverletters');
        const coverLetterCount = coverLettersData ? JSON.parse(coverLettersData).length : 0;

        setStats({
          cvsCreated: hasCVData ? 1 : 0,
          coverLetters: coverLetterCount,
          profileCompletion: progress.overall,
        });
      } catch (e) {
        console.error('Failed to load dashboard stats');
      }
    }
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold hidden sm:inline">Lebenslauf Pro</span>
          </div>
        </div>
      </header>

      <main className="container py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Willkommen zurück!
          </h1>
          <p className="text-muted-foreground text-lg">
            Verwalten Sie Ihre Lebensläufe und erstellen Sie professionelle Anschreiben.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lebensläufe
              </CardTitle>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.cvsCreated}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.cvsCreated === 0 ? 'Noch kein Lebenslauf' : 'Erstellt'}
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-secondary/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Anschreiben
              </CardTitle>
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                <Sparkles className="h-5 w-5 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{stats.coverLetters}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.coverLetters === 0 ? 'Noch keines erstellt' : 'KI-generiert'}
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-success/50 sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Profil-Vervollständigung
              </CardTitle>
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-success">{stats.profileCompletion}%</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="bg-success h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${stats.profileCompletion}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.profileCompletion === 100
                  ? 'Profil vollständig!'
                  : stats.profileCompletion > 50
                  ? 'Fast fertig'
                  : 'Noch auszufüllen'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Schnellaktionen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/">
              <Button
                size="lg"
                className="w-full h-auto py-6 px-6 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                      <Plus className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">Neuer Lebenslauf</div>
                      <div className="text-sm opacity-80">Erstellen oder bearbeiten</div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button>
            </Link>

            <Link href="/?tab=coverletter">
              <Button
                variant="secondary"
                size="lg"
                className="w-full h-auto py-6 px-6 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/10 to-secondary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-secondary-foreground/20 flex items-center justify-center">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">Anschreiben generieren</div>
                      <div className="text-sm opacity-80">KI-gestützt erstellen</div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {stats.cvsCreated === 0 && (
          <Card className="mt-8 border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Starten Sie jetzt</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Erstellen Sie Ihren ersten professionellen deutschen Lebenslauf in wenigen Minuten.
              </p>
              <Link href="/">
                <Button size="lg" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Lebenslauf erstellen
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
