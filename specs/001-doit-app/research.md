# Research: DoIt Goal Tracking App

**Created**: 2025-12-30  
**Feature**: [spec.md](spec.md)  
**Purpose**: Technology decisions and best practices for implementation

## Technology Decisions

### UI Component Library: shadcn/ui

**Decision**: Use shadcn/ui for accessible, customizable UI components

**Rationale**:
- Copy-paste components (not a runtime dependency) - aligns with minimal dependencies principle
- Built on Radix UI primitives for accessibility (WCAG compliant)
- Fully customizable with Tailwind CSS
- TypeScript-first with excellent type safety
- Modal/Dialog components handle focus management, escape key, click-outside automatically
- Form components include built-in validation patterns

**Alternatives considered**:
- Headless UI - Good accessibility but less TypeScript support, smaller ecosystem
- Custom components from scratch - Would take significantly more time and risk accessibility issues
- Radix UI directly - More verbose, shadcn provides better developer experience

**Implementation notes**:
- Install via shadcn CLI: `npx shadcn@latest init`
- Add only needed components: Dialog, Button, Input, Label
- Components go in `app/components/ui/` directory
- Customize via `tailwind.config.ts` and CSS variables

---

### Date Library: date-fns

**Decision**: Use date-fns for date formatting and calculations

**Rationale**:
- Tree-shakeable (only import functions you use) - minimal bundle impact
- Immutable date objects prevent bugs
- Functional API is predictable and easy to test manually
- Excellent TypeScript support with accurate types
- Simple format strings for display
- Timezone-aware with date-fns-tz addon if needed

**Alternatives considered**:
- Moment.js - Deprecated, large bundle size (~300KB), mutable API
- Day.js - Smaller than Moment but still larger than tree-shaken date-fns
- Native Date API - Verbose, lacks formatting, inconsistent across browsers
- Luxon - Good but heavier than date-fns for our simple use case

**Implementation notes**:
- Install: `npm install date-fns`
- Import only needed functions: `differenceInDays`, `format`, `isAfter`, `parseISO`
- Estimated bundle cost: ~2KB gzipped for functions we need
- Use ISO 8601 date strings for storage: `2025-12-30`

---

### Theme System: Tailwind CSS @theme Directive

**Decision**: Use Tailwind CSS 4.x @theme directive for pastel color customization

**Rationale**:
- New CSS-first configuration in Tailwind 4.x
- Better IDE support and autocomplete
- Allows CSS variables for dynamic theming
- More maintainable than JavaScript config
- Easy to implement fun pastel colors as requested

**Alternatives considered**:
- JavaScript tailwind.config.ts - Works but less modern approach in v4
- Inline color values - Hard to maintain, no consistency
- CSS custom properties only - Works but Tailwind @theme provides better utilities

**Implementation notes**:
```css
/* app/globals.css */
@theme {
  --color-primary: #FFB3BA;     /* Pastel pink */
  --color-secondary: #BAFFC9;   /* Pastel green */
  --color-accent: #BAE1FF;      /* Pastel blue */
  --color-warning: #FFFFBA;     /* Pastel yellow */
  --color-danger: #FFDFBA;      /* Pastel orange */
  --color-background: #FAFAFA;  /* Light gray */
  --color-surface: #FFFFFF;     /* White */
}
```

---

### State Management: React Hooks (useState, useEffect)

**Decision**: Use built-in React hooks without external state management library

**Rationale**:
- Aligns with constitutional principle: no state management libraries
- Application state is simple: array of goals
- No complex state sharing beyond immediate parent-child
- localStorage sync only needs useEffect
- Reduces bundle size and complexity

**Alternatives considered**:
- Zustand - Lightweight but unnecessary for single-page app
- Redux Toolkit - Prohibited by constitution, overkill for this app
- Context API - Adds unnecessary complexity for non-nested component tree

**Implementation notes**:
- Main state in `app/page.tsx`: `const [goals, setGoals] = useState<Goal[]>([])`
- Custom hook `useGoals` encapsulates logic: load, save, add, update, delete
- `useLocalStorage` hook handles serialization and sync
- State updates trigger localStorage writes in useEffect

---

### Data Persistence: localStorage API

**Decision**: Use browser localStorage API for goal persistence

**Rationale**:
- Native browser API, zero dependencies
- Synchronous read/write simplifies state management
- Sufficient storage for thousands of goals (~5-10MB typical limit)
- Persists across browser sessions
- No backend required per specification
- Easy to implement and debug

**Alternatives considered**:
- IndexedDB - Asynchronous, complex API, overkill for simple key-value storage
- SessionStorage - Clears on tab close, doesn't meet persistence requirement
- Backend/database - Out of scope per specification
- Cookies - 4KB limit too small, sent with every request (unnecessary overhead)

**Implementation notes**:
```typescript
// lib/storage.ts
const STORAGE_KEY = 'doit-goals';

export function saveGoals(goals: Goal[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

export function loadGoals(): Goal[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}
```

---

### Component Architecture Pattern

**Decision**: Container/Presentational component pattern with custom hooks

**Rationale**:
- Separates business logic (hooks) from presentation (components)
- Makes components more reusable and easier to understand
- Custom hooks encapsulate complex logic (storage, dates)
- Aligns with Clean Code First principle

**Implementation notes**:
- `page.tsx` - Smart container, manages state via useGoals hook
- `GoalCard.tsx` - Presentational, receives props and callbacks
- `useGoals` hook - Encapsulates all goal CRUD operations
- `date-utils.ts` - Pure functions for date calculations

---

### Form Validation Strategy

**Decision**: Client-side validation with inline error messages

**Rationale**:
- No backend means client-side validation only
- Immediate feedback improves UX (Simple UX principle)
- HTML5 validation attributes provide first layer (required, type="date")
- Custom validation for business rules (no past dates)

**Implementation notes**:
- Use HTML5 attributes: `required` on inputs
- Date input type="date" provides native picker
- Check `input.validity.valid` before submission
- Display errors below inputs using shadcn Label component
- Disable submit button while invalid

---

### Animation & Transitions

**Decision**: Tailwind CSS transition utilities with minimal animations

**Rationale**:
- Smooth transitions improve perceived performance
- Tailwind provides excellent utilities for common animations
- Avoid JavaScript animation libraries (bundle size)
- Framer Motion or similar is overkill for simple fades

**Implementation notes**:
- Modal fade in/out: `transition-opacity duration-200`
- Goal card movement: `transition-all duration-300 ease-in-out`
- Button hovers: `transition-colors duration-150`
- Action buttons slide in: `transition-transform duration-200`

---

### Responsive Design Strategy

**Decision**: Mobile-first Tailwind responsive utilities

**Rationale**:
- Constitutional requirement: responsive design
- Mobile-first ensures small screen usability
- Tailwind breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

**Implementation notes**:
```typescript
// Responsive layout
<div className="flex flex-col md:flex-row gap-4 md:gap-8">
  <GoalColumn type="active" className="w-full md:w-1/2" />
  <GoalColumn type="completed" className="w-full md:w-1/2" />
</div>
```

Breakpoints:
- Mobile (<768px): Stacked columns, full-width buttons
- Tablet (768px-1024px): Side-by-side columns, comfortable spacing
- Desktop (>1024px): Fixed max-width container, optimal reading length

---

### Accessibility Considerations

**Decision**: Use shadcn/ui Radix primitives for WCAG AA compliance

**Rationale**:
- shadcn built on Radix UI ensures keyboard navigation
- Focus management in modals handled automatically
- ARIA attributes included by default
- Color contrast checked with pastel theme

**Implementation notes**:
- Modal: Focus trap, ESC to close, click outside to close
- Buttons: Proper focus states, keyboard activation
- Form inputs: Associated labels, error announcements
- Color contrast: Ensure pastel colors meet 4.5:1 ratio for text

---

## Best Practices Applied

### Clean Code
- Single responsibility: Each component does one thing
- Descriptive names: `GoalCard`, `useGoals`, `calculateDaysRemaining`
- Pure functions in lib/ for testability (manual testing)
- TypeScript interfaces document data structures

### Simple UX
- Two-column layout is self-explanatory
- Modal centers attention on form
- Inline action buttons provide immediate feedback
- Empty states guide user to add first goal

### Responsive Design
- Mobile-first Tailwind utilities
- Touch targets minimum 44x44px
- Columns stack on mobile
- Modal adapts to viewport

### Minimal Dependencies
- shadcn/ui (copy-paste, not runtime dependency)
- date-fns (~2KB for functions used)
- Native localStorage, React hooks
- Total additional bundle: ~2KB

---

## Open Questions Resolved

### Q: How to handle overdue goals?
**A**: Display "Overdue" text, show only Delete button (no Complete option), apply maximum urgency highlighting

### Q: How to sort goals?
**A**: Active goals by deadline (soonest first), completed goals by completion date (most recent first)

### Q: Checkbox interaction pattern?
**A**: Clicking checkbox shows inline action buttons (Complete / Delete) beside the goal

### Q: Can completed goals be modified?
**A**: Yes, completed goals can be uncompleted (moved back to active) or deleted

---

## Implementation Priority

Per specification, user stories are prioritized P1-P5:

**Phase 1 (MVP)**: P1 - View and Organize Goals
- Display goals in two columns
- Calculate and show days remaining
- Sort goals appropriately
- Empty states

**Phase 2**: P2 - Add New Goals  
- Modal form
- Form validation
- localStorage save

**Phase 3**: P3 - Complete or Delete Goals
- Inline action buttons
- State transitions
- Overdue handling

**Phase 4**: P4 - Deadline Urgency Highlighting
- Conditional styling
- 3-day threshold logic

**Phase 5**: P5 - Pastel Theme Visual Design
- @theme customization
- Consistent color application
- Polish and refinement
