'use client';

import { TemplateId, TemplateMetadata } from '@/types/template';
import { getAllTemplateMetadata } from '@/lib/templates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateSwitcherProps {
  selectedTemplateId: TemplateId;
  onTemplateChange: (templateId: TemplateId) => void;
}

export function TemplateSwitcher({ selectedTemplateId, onTemplateChange }: TemplateSwitcherProps) {
  const templates = getAllTemplateMetadata();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Template auswählen</h2>
        <p className="text-sm text-gray-600 mt-1">
          Wählen Sie ein Design für Ihren Lebenslauf
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((template) => {
          const isSelected = template.id === selectedTemplateId;

          return (
            <Card
              key={template.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-lg',
                isSelected
                  ? 'ring-2 ring-blue-500 shadow-md'
                  : 'hover:ring-1 hover:ring-gray-300'
              )}
              onClick={() => onTemplateChange(template.id)}
            >
              <CardHeader className="pb-3">
                <div className="relative">
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {template.thumbnail ? (
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-xs text-center p-2">
                        {template.name}
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-base">{template.name}</CardTitle>
                <CardDescription className="text-xs">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTemplateChange(template.id);
                  }}
                >
                  {isSelected ? 'Ausgewählt' : 'Auswählen'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
