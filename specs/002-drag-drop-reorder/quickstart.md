# Developer Quickstart: Drag and Drop Goal Reordering

**Feature**: [spec.md](./spec.md)  
**Plan**: [plan.md](./plan.md)  
**Date**: December 30, 2025

## Prerequisites

- Node.js 18+ installed
- Existing DoIt app running (Next.js 16.1.1 + React 19.2.3)
- Familiarity with React hooks and TypeScript

## Installation

### 1. Install Dependencies

```bash
npm install sortablejs@1.15.3 react-sortablejs@6.1.4
```

**Why these packages**:
- `sortablejs`: Core drag-and-drop library (~20KB)
- `react-sortablejs`: React wrapper with proper TypeScript types

### 2. Verify Installation

```bash
npm list sortablejs react-sortablejs
```

Expected output:
```
├── sortablejs@1.15.3
└── react-sortablejs@6.1.4
```

## Implementation Steps

### Step 1: Update Goal Interface

**File**: `app/lib/types.ts`

Add `order` property to the Goal interface:

```typescript
export interface Goal {
  id: string;
  title: string;
  endDate: string;
  status: GoalStatus;
  createdAt: string;
  completedAt?: string;
  order: number;  // ADD THIS LINE
}
```

### Step 2: Add Migration & Reorder Logic

**File**: `app/hooks/useGoals.tsx`

Add migration and reorder function:

```typescript
// Add to useGoals hook
export function useGoals(): UseGoalsReturn {
  const [goals, setGoals] = useLocalStorage<Goal[]>(STORAGE_KEY, []);

  // NEW: Migration effect - run once on mount
  useEffect(() => {
    const migrated = localStorage.getItem('doit-migration-v2');
    if (!migrated && goals.length > 0) {
      const needsMigration = goals.some(g => g.order === undefined);
      if (needsMigration) {
        const activeGoals = goals.filter(g => g.status === 'active')
          .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
          .map((g, idx) => ({ ...g, order: idx }));
        
        const completedGoals = goals.filter(g => g.status === 'completed')
          .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
          .map((g, idx) => ({ ...g, order: idx }));
        
        setGoals([...activeGoals, ...completedGoals]);
        localStorage.setItem('doit-migration-v2', 'true');
      }
    }
  }, []);

  // NEW: Reorder function
  const reorderGoals = (goalId: string, oldIndex: number, newIndex: number, status: GoalStatus) => {
    const statusGoals = goals.filter(g => g.status === status);
    const otherGoals = goals.filter(g => g.status !== status);
    
    const [movedGoal] = statusGoals.splice(oldIndex, 1);
    statusGoals.splice(newIndex, 0, movedGoal);
    
    const reorderedStatusGoals = statusGoals.map((g, idx) => ({ ...g, order: idx }));
    setGoals([...reorderedStatusGoals, ...otherGoals]);
  };

  // Update return type
  return {
    goals,
    activeGoals,
    completedGoals,
    addGoal,
    completeGoal,
    uncompleteGoal,
    deleteGoal,
    reorderGoals, // ADD THIS
  };
}
```

### Step 3: Update Sort Logic

**File**: `app/hooks/useGoals.tsx`

Update activeGoals and completedGoals to sort by order:

```typescript
// Update existing useMemo
const activeGoals = useMemo(() => 
  goals
    .filter(g => g.status === 'active')
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999)), // Changed from endDate sort
  [goals]
);

const completedGoals = useMemo(() =>
  goals
    .filter(g => g.status === 'completed')
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999)), // Changed from completedAt sort
  [goals]
);
```

### Step 4: Make GoalColumn Sortable

**File**: `app/components/GoalColumn.tsx`

Wrap children with Sortable component:

```tsx
'use client';

import { ReactSortable } from 'react-sortablejs';
import type { GoalStatus } from '../lib/types';

interface GoalColumnProps {
  title: string;
  children: React.ReactNode;
  status: GoalStatus;
  onReorder: (oldIndex: number, newIndex: number) => void;
}

export function GoalColumn({ title, children, status, onReorder }: GoalColumnProps) {
  const isTouchDevice = typeof window !== 'undefined' 
    && window.matchMedia('(pointer: coarse)').matches;

  const childrenArray = React.Children.toArray(children);

  return (
    <div className="flex-1 min-w-[300px]">
      <h2 className="text-2xl font-semibold text-foreground mb-4">{title}</h2>
      
      <ReactSortable
        list={childrenArray.map((child, idx) => ({ id: idx.toString(), child }))}
        setList={() => {}} // Handled in onEnd
        animation={150}
        delay={isTouchDevice ? 500 : 0}
        delayOnTouchOnly={true}
        ghostClass="opacity-50 bg-blue-100"
        chosenClass="ring-2 ring-blue-500"
        dragClass="rotate-2"
        onEnd={(evt) => {
          if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
            onReorder(evt.oldIndex, evt.newIndex);
          }
        }}
        className="flex flex-col gap-4"
      >
        {childrenArray}
      </ReactSortable>
    </div>
  );
}
```

### Step 5: Update Page Component

**File**: `app/page.tsx`

Update GoalColumn usage to pass reorder handler:

```tsx
// Update GoalColumn usage for Active Goals
<GoalColumn 
  title="Active Goals" 
  status="active"
  onReorder={(oldIdx, newIdx) => reorderGoals(activeGoals[oldIdx].id, oldIdx, newIdx, 'active')}
>
  {activeGoals.length === 0 ? (
    <EmptyState message="No active goals yet..." />
  ) : (
    activeGoals.map(goal => (
      <GoalCard 
        key={goal.id} 
        goal={goal}
        onComplete={completeGoal}
        onDelete={deleteGoal}
      />
    ))
  )}
</GoalColumn>

// Repeat for Completed Goals column
<GoalColumn 
  title="Completed Goals"
  status="completed"
  onReorder={(oldIdx, newIdx) => reorderGoals(completedGoals[oldIdx].id, oldIdx, newIdx, 'completed')}
>
  {/* ... */}
</GoalColumn>
```

### Step 6: Add Keyboard Navigation (Optional but Recommended)

**File**: `app/components/GoalCard.tsx`

Add keyboard event handlers:

```tsx
// Add to GoalCard component
const [isGrabMode, setIsGrabMode] = useState(false);

const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    setIsGrabMode(!isGrabMode);
    // TODO: Announce state change to screen readers
  }
  
  if (isGrabMode) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      // TODO: Call onMoveUp prop
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      // TODO: Call onMoveDown prop
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsGrabMode(false);
    }
  }
};

// Add to card div
<div
  tabIndex={0}
  onKeyDown={handleKeyDown}
  className={cn(
    "...",
    isGrabMode && "ring-4 ring-blue-500"
  )}
>
```

## Testing Checklist

### Manual Verification

- [ ] Can drag active goal to new position with mouse
- [ ] Can drag completed goal to new position with mouse
- [ ] Long-press works on mobile/tablet devices
- [ ] Order persists after page refresh
- [ ] Visual feedback appears during drag (ghost + drop line)
- [ ] Auto-scroll works when dragging near top/bottom
- [ ] Keyboard navigation works (Tab, Space, Arrows)
- [ ] Escape cancels drag operation
- [ ] Migration runs on first load (existing goals get order values)

### Performance Checks

- [ ] Smooth drag with 10 goals
- [ ] Smooth drag with 50 goals  
- [ ] Smooth drag with 100 goals
- [ ] No console errors or warnings
- [ ] localStorage updates correctly

## Troubleshooting

### Issue: Drag doesn't work on touch devices

**Solution**: Ensure `delay` and `delayOnTouchOnly` are set in Sortable options

### Issue: Order values not persisting

**Solution**: Check that `reorderGoals` is updating the goals array and triggering localStorage save via `useLocalStorage` hook

### Issue: Migration not running

**Solution**: Clear localStorage and reload: `localStorage.clear(); location.reload()`

### Issue: TypeScript errors on Sortable types

**Solution**: Add type assertion or install `@types/sortablejs` if missing

## Architecture Notes

### Component Hierarchy

```
page.tsx
└── GoalColumn (Sortable wrapper)
    └── GoalCard[] (Draggable items)
```

### State Flow

1. User drags goal → Sortable onEnd fires
2. onEnd calls reorderGoals with indices
3. reorderGoals updates order values in goals array
4. useLocalStorage detects change and persists
5. React re-renders with new order

### Performance Optimization

- GoalCard uses React.memo to prevent re-renders during drag
- Order updates batch via single setState call
- localStorage writes are automatic via useLocalStorage hook

## Next Steps

After implementing basic drag-and-drop:

1. Add visual drop indicator line (currently just ghost)
2. Implement full keyboard navigation with screen reader support
3. Add haptic feedback for touch devices
4. Consider animations for goal position changes

## Reference

- [SortableJS Docs](https://github.com/SortableJS/Sortable)
- [react-sortablejs Docs](https://github.com/SortableJS/react-sortablejs)
- Feature spec: [spec.md](./spec.md)
- Data model: [data-model.md](./data-model.md)
