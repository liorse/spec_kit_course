'use client';

// Empty state component for when no goals exist
import { ClipboardList } from 'lucide-react';

interface EmptyStateProps {
  message: string;
}

/**
 * Display message when no goals exist in a column
 */
export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-xl border-2 border-dashed border-border/60 bg-muted/10">
      <div className="bg-muted/50 p-3 rounded-full mb-3">
        <ClipboardList className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-sm max-w-[200px]">{message}</p>
    </div>
  );
}
