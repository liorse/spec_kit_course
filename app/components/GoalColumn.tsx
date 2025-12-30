'use client';

// Reusable column container component with drag-and-drop support
import { ReactSortable } from 'react-sortablejs';
import type { ReactNode } from 'react';
import type { GoalStatus } from '../lib/types';
import { Children } from 'react';

interface GoalColumnProps {
  title: string;
  children: ReactNode;
  status: GoalStatus;
  onReorder: (oldIndex: number, newIndex: number) => void;
}

/**
 * Column container for displaying a group of goals with drag-and-drop reordering
 * Used for both "Active Goals" and "Completed Goals" columns
 */
export function GoalColumn({ title, children, status, onReorder }: GoalColumnProps) {
  // Detect touch device for long-press delay
  const isTouchDevice = typeof window !== 'undefined' 
    && window.matchMedia('(pointer: coarse)').matches;

  // Convert children to array for ReactSortable
  const childrenArray = Children.toArray(children);
  const sortableList = childrenArray.map((child, idx) => ({ 
    id: `${status}-${idx}`,
    child 
  }));

  return (
    <div className="flex-1 min-w-0">
      <h2 className="text-2xl font-bold mb-4 text-foreground">{title}</h2>
      
      <ReactSortable
        list={sortableList}
        setList={() => {}} // Handled in onEnd
        animation={150}
        delay={isTouchDevice ? 500 : 0}
        delayOnTouchOnly={true}
        ghostClass="sortable-ghost"
        chosenClass="sortable-chosen"
        dragClass="sortable-drag"
        forceFallback={true}
        onEnd={(evt) => {
          if (evt.oldIndex !== undefined && evt.newIndex !== undefined && evt.oldIndex !== evt.newIndex) {
            onReorder(evt.oldIndex, evt.newIndex);
          }
        }}
        className="space-y-3 min-h-[100px]"
      >
        {sortableList.map((item) => (
          <div key={item.id}>{item.child}</div>
        ))}
      </ReactSortable>
    </div>
  );
}
