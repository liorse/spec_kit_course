'use client';

// Empty state component for when no goals exist

interface EmptyStateProps {
  message: string;
}

/**
 * Display message when no goals exist in a column
 */
export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4 rounded-lg border-2 border-dashed border-border bg-muted/30">
      <p className="text-muted-foreground text-lg">{message}</p>
    </div>
  );
}
