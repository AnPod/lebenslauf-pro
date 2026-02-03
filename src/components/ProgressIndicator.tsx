import React from 'react';
import { cn } from '@/lib/utils';
import type { ProgressResult } from '@/lib/progress';

interface ProgressIndicatorProps {
  progress: ProgressResult;
  showSections?: boolean;
  className?: string;
}

export function ProgressIndicator({ progress, showSections = false, className }: ProgressIndicatorProps) {
  const { overall, sections } = progress;

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Overall Progress</span>
        <span className="text-sm font-bold text-gray-900">{overall}%</span>
      </div>

      <div className="relative h-3 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${overall}%` }}
        />
      </div>

      {showSections && (
        <div className="mt-4 space-y-3">
          {sections.map((section) => (
            <div key={section.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{section.name}</span>
                <span className="text-gray-500">
                  {section.completed}/{section.total}
                </span>
              </div>
              <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${section.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
