'use client';

// Reusable column container component
import type { ReactNode } from 'react';

interface GoalColumnProps {
  title: string;
  children: ReactNode;
}

/**
 * Column container for displaying a group of goals
 * Used for both "Active Goals" and "Completed Goals" columns
 */
export function GoalColumn({ title, children }: GoalColumnProps) {
  return (
    <div className="flex-1 min-w-0">
      <h2 className="text-2xl font-bold mb-4 text-foreground">{title}</h2>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}
