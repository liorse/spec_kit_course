# Research: Drag and Drop Goal Reordering

**Feature**: [spec.md](./spec.md)  
**Date**: December 30, 2025

## Technology Decisions

### Decision 1: Drag-and-Drop Library

**Decision**: SortableJS (via react-sortablejs wrapper)

**Rationale**: 
- Lightweight (~20KB gzipped) - aligns with "Minimal Dependencies" principle
- Supports mouse, touch, and keyboard interactions out of the box
- Provides visual feedback APIs (ghost elements, drop indicators) without heavy customization
- Battle-tested library used in production by Trello, Asana, and other major apps
- Active maintenance (latest release within 6 months)
- Works seamlessly with React via react-sortablejs wrapper
- Zero peer dependencies beyond React

**Alternatives considered**:
- **@dnd-kit**: More modern but heavier (~50KB), more complex API, overkill for simple vertical list reordering
- **react-beautiful-dnd**: Deprecated by Atlassian, not actively maintained
- **Native HTML5 Drag-and-Drop API**: Poor touch support, inconsistent browser behavior, requires significant custom code for keyboard accessibility
- **Custom implementation**: Would require 500+ lines of code to handle mouse/touch/keyboard events, auto-scroll, and accessibility - violates DRY principle

### Decision 2: Position/Order Storage Strategy

**Decision**: Add `order` property (number) to Goal interface, update on every reorder

**Rationale**:
- Simple to implement and reason about
- Minimal changes to existing data model
- Order value determines rendering sequence
- Easy to persist in localStorage (already used by the app)
- No complex re-indexing needed - just swap order values

**Alternatives considered**:
- **Array index only**: Fragile, can break on concurrent edits, hard to maintain consistency
- **Linked list (prev/next IDs)**: Overly complex for this use case, harder to debug
- **Fractional indexing**: Sophisticated but unnecessary complexity for 100-goal limit

### Decision 3: Auto-Scroll Implementation

**Decision**: Use SortableJS built-in scroll plugin

**Rationale**:
- SortableJS includes scroll plugin that handles auto-scroll when dragging near viewport edges
- Configurable speed and sensitivity
- Works with both desktop and mobile
- No additional code needed

**Alternatives considered**:
- **Custom auto-scroll**: Would require listening to drag position, calculating viewport boundaries, and implementing smooth scrolling - SortableJS already solves this

### Decision 4: Visual Feedback Styling

**Decision**: Tailwind classes for ghost element and drop indicator line

**Rationale**:
- Constitutional requirement: "Tailwind CSS MUST be used for all styling"
- SortableJS exposes CSS classes for ghost element and chosen state
- Can use Tailwind utility classes directly in className attributes
- Drop indicator: absolute-positioned 2px colored line using Tailwind border utilities

**Implementation approach**:
```tsx
// Ghost element (being dragged)
ghostClass="opacity-50 bg-blue-100 rotate-2"

// Chosen element (original position)
chosenClass="ring-2 ring-blue-500"

// Drop indicator (between goals)
<div className="absolute left-0 right-0 h-0.5 bg-blue-500" />
```

### Decision 5: Keyboard Navigation Pattern

**Decision**: Implement custom keyboard handler using SortableJS onStart/onEnd callbacks

**Rationale**:
- SortableJS has limited keyboard support by default
- Need to add custom logic for Tab/Space/Arrow key navigation per spec
- Use React state to track "grab mode" when Space/Enter pressed
- Arrow keys move goal position in array while in grab mode
- Space/Enter again to drop

**Implementation approach**:
```typescript
// Pseudo-code
- onKeyDown listener on each goal card
- Tab: focus next/previous goal (browser default)
- Space/Enter: toggle grabMode for focused goal
- If grabMode active:
  - Arrow Up: move goal up in order
  - Arrow Down: move goal down in order
  - Escape: cancel and restore original position
  - Space/Enter: commit new position
```

### Decision 6: Touch Device Long-Press

**Decision**: Configure SortableJS delay option for touch devices

**Rationale**:
- SortableJS has built-in `delay` option for touch devices
- Set delay to 500ms on touch devices (detected via `window.matchMedia('(pointer: coarse)')`)
- Prevents accidental drags while scrolling
- Provides haptic feedback opportunity (browser vibration API)

**Implementation approach**:
```typescript
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
const sortableOptions = {
  delay: isTouchDevice ? 500 : 0,
  delayOnTouchOnly: true,
};
```

## Integration Points

### Existing Code Integration

**Files to modify**:
1. `app/lib/types.ts` - Add `order: number` to Goal interface
2. `app/hooks/useGoals.tsx` - Add `reorderGoals(goalId, newIndex)` function
3. `app/components/GoalColumn.tsx` - Wrap goal list with Sortable component
4. `app/components/GoalCard.tsx` - Add keyboard event handlers

**Data migration**:
- On first load after feature deployment, assign order values based on current array index
- Store migration version in localStorage to avoid re-running

### Performance Considerations

**Goal**: Support up to 100 goals without degradation (SC-007)

**Strategy**:
- SortableJS uses CSS transforms for drag animations (GPU-accelerated)
- React memo() on GoalCard to prevent unnecessary re-renders during drag
- Only update order values on drop (not during drag) to minimize state changes
- Debounce localStorage writes if performance issues observed

## Best Practices Applied

### From SortableJS Documentation

1. **Use fallback option for better cross-browser support**
2. **Set forceFallback: true** for consistent behavior across devices
3. **Use animation property** for smooth transitions (150ms recommended)
4. **Handle scroll containers properly** - ensure scroll container is identified
5. **Clean up event listeners** - use React useEffect cleanup

### Accessibility (WCAG 2.1 AA)

1. **Keyboard navigation** - Full keyboard support as specified
2. **Focus indicators** - Visible focus rings using Tailwind ring utilities
3. **Screen reader announcements** - aria-live region for reorder confirmations
4. **Semantic HTML** - Use proper list markup (ul/li or role="list")

### Responsive Design

1. **Touch targets** - Goal cards already 44px+ height (meets mobile minimum)
2. **Responsive spacing** - Tailwind responsive classes for desktop vs mobile
3. **Viewport adaptation** - Auto-scroll works on all screen sizes

## Open Questions / Risks

**None** - All clarifications were resolved in the specification clarification phase.

## References

- [SortableJS Documentation](https://github.com/SortableJS/Sortable)
- [react-sortablejs Wrapper](https://github.com/SortableJS/react-sortablejs)
- [WCAG 2.1 Drag and Drop Guidance](https://www.w3.org/WAI/WCAG21/Understanding/dragging-movements.html)
- [Touch Target Sizing](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
