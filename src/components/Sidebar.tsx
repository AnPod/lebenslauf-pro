'use client';

import { useState } from 'react';
import { User, FileText, Briefcase, GraduationCap, Wrench, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { cn } from '@/lib/utils';
import type { ProgressResult } from '@/lib/progress';

export type Section = 'personal' | 'profile' | 'experience' | 'education' | 'skills';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  progress?: ProgressResult;
}

const navigationItems = [
  {
    id: 'personal' as Section,
    label: 'Persönliche Daten',
    description: 'Name, Kontakt, Adresse',
    icon: User,
  },
  {
    id: 'profile' as Section,
    label: 'Profil',
    description: 'Zusammenfassung',
    icon: FileText,
  },
  {
    id: 'experience' as Section,
    label: 'Berufserfahrung',
    description: 'Positionen',
    icon: Briefcase,
  },
  {
    id: 'education' as Section,
    label: 'Ausbildung',
    description: 'Abschlüsse',
    icon: GraduationCap,
  },
  {
    id: 'skills' as Section,
    label: 'Fähigkeiten',
    description: 'Kompetenzen',
    icon: Wrench,
  },
];

export function Sidebar({ activeSection, onSectionChange, progress }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSectionClick = (section: Section) => {
    onSectionChange(section);
    setMobileOpen(false);

    const element = document.getElementById(`section-${section}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const NavItems = () => (
    <nav className="space-y-1" aria-label="CV sections navigation">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handleSectionClick(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200',
              'hover:bg-accent hover:text-accent-foreground',
              isActive
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground'
            )}
            aria-label={`Navigate to ${item.label}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon
              className={cn(
                'h-5 w-5 flex-shrink-0 transition-colors',
                isActive ? 'text-primary-foreground' : 'text-muted-foreground'
              )}
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{item.label}</div>
              <div
                className={cn(
                  'text-xs',
                  isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                )}
              >
                {item.description}
              </div>
            </div>
            {isActive && (
              <div className="h-2 w-2 rounded-full bg-primary-foreground flex-shrink-0" />
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-20 space-y-4">
          {progress && (
            <div className="px-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Fortschritt
              </h2>
              <ProgressIndicator progress={progress} />
            </div>
          )}
          <div className="px-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Sektionen
            </h2>
          </div>
          <NavItems />
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full shadow-lg"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Navigation</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {progress && (
                <div>
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Fortschritt
                  </h2>
                  <ProgressIndicator progress={progress} />
                </div>
              )}
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Sektionen
                </h2>
                <NavItems />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
