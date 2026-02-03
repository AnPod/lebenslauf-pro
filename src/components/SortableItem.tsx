'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  index: number;
  total: number;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  className?: string;
}

export function SortableItem({
  id,
  children,
  index,
  total,
  onMoveUp,
  onMoveDown,
  className,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('relative group', className)}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto"
        style={{ touchAction: 'none' }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-grab active:cursor-grabbing hover:bg-muted"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        <div className="flex flex-col gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-muted"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp?.();
            }}
            disabled={index === 0}
            aria-label="Move up"
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-muted"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown?.();
            }}
            disabled={index === total - 1}
            aria-label="Move down"
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className={cn(isDragging && 'shadow-lg scale-[1.02]')}>
        {children}
      </div>
    </div>
  );
}
