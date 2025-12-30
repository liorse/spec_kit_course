# Data Model: Drag and Drop Goal Reordering

**Feature**: [spec.md](./spec.md)  
**Research**: [research.md](./research.md)  
**Date**: December 30, 2025

## Entity Changes

### Goal (Modified)

**Purpose**: Represents a user's goal with deadline tracking and reorderable position

**Changes from existing**:
- **Added**: `order: number` - Determines display position in the list (lower number = higher in list)

**Complete interface**:
```typescript
interface Goal {
  id: string;              // UUID v4 for uniqueness (existing)
  title: string;           // User-defined goal description (existing)
  endDate: string;         // ISO 8601 date string (existing)
  status: GoalStatus;      // 'active' | 'completed' (existing)
  createdAt: string;       // ISO 8601 timestamp (existing)
  completedAt?: string;    // ISO 8601 timestamp (existing)
  order: number;           // NEW: Position in list (0-based, lower = higher priority)
}
```

**Validation rules**:
- `order` must be non-negative integer
- `order` must be unique within a status group (activeGoals, completedGoals)
- When new goal added, `order` = max(existing orders) + 1
- When goal reordered, update `order` values to maintain sequence

**State transitions**:
- **Add new goal**: Assign order = current max order + 1
- **Reorder within status**: Update order values for affected goals
- **Complete goal**: Keep order value, move to completed list (maintains relative position in completed)
- **Uncomplete goal**: Keep order value, move to active list (may need re-ordering based on endDate)
- **Delete goal**: No impact on other goals' order values (gaps are acceptable)

## Storage Schema

### localStorage Structure

**Key**: `doit-goals` (existing, unchanged)

**Value**: JSON array of Goal objects

**Example**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Finish project proposal",
    "endDate": "2025-12-31",
    "status": "active",
    "createdAt": "2025-12-20T10:00:00Z",
    "order": 0
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Review budget",
    "endDate": "2025-12-28",
    "status": "active",
    "createdAt": "2025-12-19T15:30:00Z",
    "order": 1
  },
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "title": "Complete Q4 report",
    "endDate": "2025-12-15",
    "status": "completed",
    "createdAt": "2025-12-01T09:00:00Z",
    "completedAt": "2025-12-14T17:45:00Z",
    "order": 0
  }
]
```

### Migration Strategy

**Scenario**: Existing goals in localStorage without `order` property

**Approach**:
1. On app load, check if any goal lacks `order` property
2. If migration needed:
   - Sort active goals by current logic (endDate ascending)
   - Assign order = array index
   - Sort completed goals by current logic (completedAt descending)
   - Assign order = array index
   - Save updated goals to localStorage
3. Set migration flag in localStorage (`doit-migration-v2: true`) to avoid re-running

**Migration code location**: `app/hooks/useGoals.tsx` (in initialization useEffect)

## Sorting & Ordering Logic

### Display Order

**Active Goals**:
- Primary sort: `order` (ascending)
- Secondary sort (fallback if orders equal): `endDate` (ascending)

**Completed Goals**:
- Primary sort: `order` (ascending)  
- Secondary sort (fallback if orders equal): `completedAt` (descending)

### Reorder Operation

**Input**: 
- `goalId`: ID of goal being moved
- `newIndex`: Target position in the filtered list (0-based)

**Process**:
1. Get current filtered list (activeGoals or completedGoals based on goal status)
2. Find current index of goal in filtered list
3. Remove goal from current position
4. Insert goal at new position
5. Reassign order values sequentially (0, 1, 2, ...) based on new array order
6. Update goals in state
7. Persist to localStorage

**Example**:
```typescript
// Before reorder: [Goal A (order:0), Goal B (order:1), Goal C (order:2)]
// Move Goal C from index 2 to index 0

// After reorder: [Goal C (order:0), Goal A (order:1), Goal B (order:2)]
```

## Performance Considerations

### Indexing Strategy

**No database indexes needed** - Using localStorage with in-memory operations

**Optimization**: 
- useMemo for sorted lists (already implemented in useGoals)
- Only recalculate when goals array changes
- Reorder operation is O(n) where n = number of goals in status group

### Memory Footprint

**Estimate for 100 goals**:
- Average goal: ~200 bytes (with all properties)
- 100 goals: ~20KB
- Well within localStorage limits (5-10MB depending on browser)
- Negligible memory impact on modern devices

## Relationships

### No External Dependencies

Goals remain self-contained entities. No relationships to users, projects, or categories (per constitutional "Simple UX" principle).

### Internal Consistency Rules

1. `order` values must remain synchronized within each status group
2. Gaps in order sequence are acceptable (simplifies delete operations)
3. Order is status-specific - active and completed goals have independent ordering

## Data Integrity

### Constraints

- **Uniqueness**: `id` must be unique across all goals
- **Order**: `order` must be non-negative integer
- **Status consistency**: Goals with `completedAt` must have status='completed'

### Error Handling

**Invalid order value**: 
- Fallback to endDate/completedAt sorting
- Log warning to console
- Auto-repair on next reorder operation

**Missing order property**:
- Trigger migration on detection
- Assign based on current sort order

**Concurrent modifications**:
- Not applicable (single-user app with localStorage)
- If multi-user in future: implement optimistic updates with conflict resolution

## Schema Version

**Current**: v2 (adds `order` property)  
**Previous**: v1 (original schema without order)  
**Migration**: Automatic on first load (see Migration Strategy above)
