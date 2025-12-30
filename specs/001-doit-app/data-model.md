# Data Model: DoIt Goal Tracking App

**Created**: 2025-12-30  
**Feature**: [spec.md](spec.md)  
**Purpose**: Define data structures and state management

## Entities

### Goal

Represents a user's objective with a deadline.

**TypeScript Interface**:
```typescript
interface Goal {
  id: string;              // UUID v4 for uniqueness
  title: string;           // User-defined goal description
  endDate: string;         // ISO 8601 date string (YYYY-MM-DD)
  status: GoalStatus;      // 'active' | 'completed'
  createdAt: string;       // ISO 8601 timestamp
  completedAt?: string;    // ISO 8601 timestamp (only for completed goals)
}

type GoalStatus = 'active' | 'completed';
```

**Field Specifications**:

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| id | string | Yes | UUID v4 format | Generated on creation using crypto.randomUUID() |
| title | string | Yes | 1-200 characters, not empty | User-facing goal description |
| endDate | string | Yes | ISO 8601 date, must be future date on creation | Deadline for goal completion |
| status | GoalStatus | Yes | Must be 'active' or 'completed' | Current state of goal |
| createdAt | string | Yes | ISO 8601 timestamp | Auto-generated on goal creation |
| completedAt | string | No | ISO 8601 timestamp, only when status='completed' | Timestamp when goal was marked complete |

**Validation Rules**:

1. **Title Validation**:
   - Cannot be empty or only whitespace
   - Maximum length 200 characters
   - Trimmed before storage

2. **End Date Validation**:
   - Must be valid ISO 8601 date string
   - Cannot be in the past (for new goals)
   - Overdue goals (past endDate) can exist but cannot be completed

3. **Status Transitions**:
   - `active` → `completed`: Sets completedAt timestamp
   - `completed` → `active`: Clears completedAt timestamp
   - `active` → deleted: Removes from storage
   - `completed` → deleted: Removes from storage

4. **Business Rules**:
   - Overdue goals (endDate < today) can only be deleted, not completed
   - Uncompleting a goal restores original endDate
   - Goals sorted by endDate (active) or completedAt (completed)

---

## Calculated Properties

These are derived values computed on-demand, not stored:

### Days Remaining

```typescript
function calculateDaysRemaining(goal: Goal): number | 'overdue' {
  const today = new Date();
  const deadline = parseISO(goal.endDate);
  const days = differenceInDays(deadline, today);
  
  return days < 0 ? 'overdue' : days;
}
```

**Logic**:
- Returns positive number for future dates
- Returns 'overdue' for past dates
- Uses date-fns `differenceInDays` for accurate calculation
- Calculates at midnight boundary

### Urgency Level

```typescript
type UrgencyLevel = 'normal' | 'urgent' | 'overdue';

function getUrgencyLevel(goal: Goal): UrgencyLevel {
  const daysRemaining = calculateDaysRemaining(goal);
  
  if (daysRemaining === 'overdue') return 'overdue';
  if (daysRemaining <= 3) return 'urgent';
  return 'normal';
}
```

**Logic**:
- `overdue`: Past endDate
- `urgent`: 0-3 days remaining
- `normal`: 4+ days remaining

### Display Text

```typescript
function getDaysRemainingText(goal: Goal): string {
  const daysRemaining = calculateDaysRemaining(goal);
  
  if (daysRemaining === 'overdue') return 'Overdue';
  if (daysRemaining === 0) return 'Due today';
  if (daysRemaining === 1) return '1 day left';
  return `${daysRemaining} days left`;
}
```

---

## State Management

### Application State

**Location**: `app/page.tsx` (root component)

```typescript
interface AppState {
  goals: Goal[];
  isModalOpen: boolean;
  selectedGoalId: string | null;
}
```

**State Hooks**:
```typescript
const [goals, setGoals] = useState<Goal[]>([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
```

### Custom Hooks

#### useGoals Hook

```typescript
interface UseGoalsReturn {
  goals: Goal[];
  activeGoals: Goal[];
  completedGoals: Goal[];
  addGoal: (title: string, endDate: string) => void;
  completeGoal: (id: string) => void;
  uncompleteGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
  isLoading: boolean;
}

function useGoals(): UseGoalsReturn {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadGoals();
    setGoals(loaded);
    setIsLoading(false);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoading) {
      saveGoals(goals);
    }
  }, [goals, isLoading]);

  // Computed values
  const activeGoals = useMemo(() => 
    goals
      .filter(g => g.status === 'active')
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()),
    [goals]
  );

  const completedGoals = useMemo(() =>
    goals
      .filter(g => g.status === 'completed')
      .sort((a, b) => 
        new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
      ),
    [goals]
  );

  // CRUD operations
  const addGoal = (title: string, endDate: string) => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title: title.trim(),
      endDate,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const completeGoal = (id: string) => {
    setGoals(prev => prev.map(goal =>
      goal.id === id
        ? { ...goal, status: 'completed', completedAt: new Date().toISOString() }
        : goal
    ));
  };

  const uncompleteGoal = (id: string) => {
    setGoals(prev => prev.map(goal =>
      goal.id === id
        ? { ...goal, status: 'active', completedAt: undefined }
        : goal
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  return {
    goals,
    activeGoals,
    completedGoals,
    addGoal,
    completeGoal,
    uncompleteGoal,
    deleteGoal,
    isLoading,
  };
}
```

#### useLocalStorage Hook

```typescript
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}
```

---

## Storage Schema

### localStorage Key

```
Key: "doit-goals"
```

### Storage Format

```typescript
// Serialized JSON array
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project documentation",
    "endDate": "2025-12-31",
    "status": "active",
    "createdAt": "2025-12-15T10:30:00.000Z"
  },
  {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "title": "Learn TypeScript",
    "endDate": "2025-11-30",
    "status": "completed",
    "createdAt": "2025-11-01T08:00:00.000Z",
    "completedAt": "2025-11-28T16:45:00.000Z"
  }
]
```

**Storage Operations**:

1. **Load**: `JSON.parse(localStorage.getItem('doit-goals') || '[]')`
2. **Save**: `localStorage.setItem('doit-goals', JSON.stringify(goals))`
3. **Clear**: `localStorage.removeItem('doit-goals')`

**Error Handling**:
- Catch JSON.parse errors (corrupted data)
- Return empty array if key doesn't exist
- Log errors to console
- Gracefully degrade (show empty state)

**Size Estimation**:
- Average goal: ~200 bytes serialized
- 1000 goals: ~200KB
- Well within localStorage ~5-10MB limit

---

## Data Flow

### Add Goal Flow

```
User Input (title, endDate)
  ↓
Validation (non-empty title, valid future date)
  ↓
addGoal(title, endDate)
  ↓
Generate new Goal object (UUID, timestamps)
  ↓
Update state: setGoals([...goals, newGoal])
  ↓
useEffect triggers localStorage.setItem
  ↓
Re-render with new goal in active column
```

### Complete Goal Flow

```
User clicks Complete button
  ↓
completeGoal(goalId)
  ↓
Update goal: status='completed', completedAt=now
  ↓
Update state with modified goal
  ↓
useEffect triggers localStorage.setItem
  ↓
Re-render: goal moves to completed column
```

### Uncomplete Goal Flow

```
User clicks Uncomplete button on completed goal
  ↓
uncompleteGoal(goalId)
  ↓
Update goal: status='active', completedAt=undefined
  ↓
Update state with modified goal
  ↓
useEffect triggers localStorage.setItem
  ↓
Re-render: goal moves back to active column
```

### Delete Goal Flow

```
User clicks Delete button
  ↓
deleteGoal(goalId)
  ↓
Filter goal out of array
  ↓
Update state without deleted goal
  ↓
useEffect triggers localStorage.setItem
  ↓
Re-render: goal removed from DOM
```

---

## Relationships

This is a simple single-entity model with no relationships:

- No users (single-user app)
- No categories or tags
- No parent/child goal relationships
- No goal dependencies

All complexity is in sorting and filtering logic, not data relationships.

---

## Migration Strategy

**v1.0.0 (Initial Release)**: Schema defined above

**Future Considerations** (if needed):
- Add `version` field to detect schema changes
- Implement migration function to upgrade old data
- Store version separately: `localStorage.getItem('doit-schema-version')`

**Example Migration Pattern**:
```typescript
function migrateGoals(goals: any[]): Goal[] {
  return goals.map(goal => {
    // v1.0.0 → v1.1.0: Add new field
    if (!goal.category) {
      goal.category = 'general';
    }
    return goal;
  });
}
```

Not needed for initial implementation per specification scope.
