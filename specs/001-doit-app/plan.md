# Implementation Plan: DoIt Goal Tracking App

**Branch**: `001-doit-app` | **Date**: 2025-12-30 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-doit-app/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

Build a browser-based goal tracking web application that displays active goals with countdown timers in a left column and completed goals in a right column. Users can add, complete, uncomplete, and delete goals through an intuitive modal-based form and inline action buttons. The app uses localStorage for persistence, shadcn/ui for accessible components, Tailwind CSS @theme for pastel color theming, and date-fns for date calculations. No backend or authentication required - pure client-side React application within Next.js App Router structure.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 16.1.1 and React 19.2.3  
**Primary Dependencies**: 
- shadcn/ui (accessible UI components)
- Tailwind CSS 4.x with @theme directive (pastel color theming)
- date-fns (date formatting and calculations)
- React hooks (useState, useEffect for state management)
- Browser localStorage API (goal persistence)

**Storage**: Browser localStorage for client-side goal persistence  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge) - desktop, tablet, mobile  
**Project Type**: Single Next.js web application (App Router)  
**Performance Goals**: 
- Page load < 2 seconds on broadband
- Instantaneous UI feedback for all interactions
- Smooth animations for goal transitions
- Support 100+ goals without performance degradation

**Constraints**: 
- No backend/API required - pure client-side application
- localStorage size limits (~5-10MB typical, sufficient for thousands of goals)
- Must work offline after initial page load
- No authentication/multi-user support

**Scale/Scope**: 
- Single-page application
- 5 main user stories (P1-P5)
- ~8-12 React components
- ~5-7 TypeScript types/interfaces
- Single user per browser
- Personal use case (not enterprise scale)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Clean Code First
- **Compliance**: Components will follow single responsibility principle
- **Compliance**: TypeScript ensures type safety and self-documenting code
- **Compliance**: Descriptive component and function names planned
- **Status**: PASS

### ✅ Simple UX (NON-NEGOTIABLE)
- **Compliance**: Modal form with clear labels for goal creation
- **Compliance**: Inline action buttons for immediate feedback
- **Compliance**: Two-column layout is intuitive and self-explanatory
- **Compliance**: Empty states guide users to add their first goal
- **Status**: PASS

### ✅ Responsive Design (NON-NEGOTIABLE)
- **Compliance**: Tailwind responsive utilities for mobile/tablet/desktop
- **Compliance**: Two-column layout will stack on mobile (<768px)
- **Compliance**: Touch targets minimum 44x44px per spec
- **Compliance**: Modal dialogs adapt to viewport size
- **Status**: PASS

### ✅ Minimal Dependencies
- **Compliance**: shadcn/ui is copy-paste components (not a package dependency)
- **Compliance**: date-fns is lightweight (~2KB gzipped for used functions)
- **Compliance**: Using native localStorage API (no storage library)
- **Compliance**: No state management library (React hooks sufficient)
- **Justification**: All dependencies provide significant value vs bundle cost
- **Status**: PASS

### ✅ No Testing (NON-NEGOTIABLE - SUPERSEDES ALL OTHER GUIDANCE)
- **Compliance**: No test files or test frameworks will be added
- **Compliance**: Manual browser verification across viewports only
- **Compliance**: Plan excludes all test-related tasks and infrastructure
- **Status**: PASS

### ✅ Technology Stack
- **Compliance**: Next.js 16.1.1 ✓
- **Compliance**: React 19.2.3 ✓
- **Compliance**: Tailwind CSS 4.x ✓
- **Compliance**: TypeScript 5.x ✓
- **Compliance**: No prohibited technologies (no Jest, Redux, Material-UI, etc.)
- **Status**: PASS

**OVERALL STATUS**: ✅ ALL GATES PASSED - Proceed to Phase 0 research

## Project Structure

### Documentation (this feature)

```text
specs/001-doit-app/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output - technology decisions
├── data-model.md        # Phase 1 output - Goal entity and state management
├── quickstart.md        # Phase 1 output - manual verification scenarios
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── page.tsx             # Main goal tracking page (two-column layout)
├── layout.tsx           # Root layout (existing)
├── globals.css          # Tailwind imports and @theme customization
├── components/
│   ├── GoalColumn.tsx   # Reusable column container component
│   ├── GoalCard.tsx     # Individual goal display with action buttons
│   ├── AddGoalButton.tsx # Floating action button to open modal
│   ├── AddGoalModal.tsx # Modal form for creating new goals
│   └── EmptyState.tsx   # Display when no goals exist
├── lib/
│   ├── types.ts         # TypeScript interfaces (Goal, GoalStatus)
│   ├── storage.ts       # localStorage wrapper functions
│   ├── date-utils.ts    # Date calculations using date-fns
│   └── theme.ts         # Tailwind theme configuration helper
└── hooks/
    ├── useGoals.tsx     # Custom hook for goal state management
    └── useLocalStorage.tsx # Generic localStorage hook

public/
└── (static assets as needed)
```

**Structure Decision**: Single Next.js application using App Router. All goal management happens client-side in the main page component with child components for modularity. The `lib/` folder contains pure functions for storage and date manipulation, while `hooks/` provides React state management. Components are organized by functionality (presentation vs. interaction).

## Post-Design Constitution Check

*Re-evaluation after Phase 1 design completion*

### ✅ Clean Code First
- **Design Review**: Component architecture follows single responsibility
- **Design Review**: TypeScript interfaces clearly document data structures
- **Design Review**: Pure functions in lib/ for date calculations
- **Design Review**: Custom hooks encapsulate complex state logic
- **Status**: PASS - Design supports clean, maintainable code

### ✅ Simple UX (NON-NEGOTIABLE)
- **Design Review**: Modal UX is straightforward (form with two fields)
- **Design Review**: Inline action buttons provide immediate feedback
- **Design Review**: Empty states guide new users
- **Design Review**: No complex navigation or hidden features
- **Status**: PASS - Design maintains simple, intuitive interactions

### ✅ Responsive Design (NON-NEGOTIABLE)
- **Design Review**: Tailwind responsive utilities planned for all breakpoints
- **Design Review**: Mobile-first approach with column stacking <768px
- **Design Review**: Touch targets meet 44x44px minimum requirement
- **Design Review**: Modal adapts to viewport size
- **Status**: PASS - Design implements responsive patterns

### ✅ Minimal Dependencies
- **Design Review**: shadcn/ui is copy-paste components (not runtime dependency)
- **Design Review**: date-fns tree-shakeable (~2KB for functions used)
- **Design Review**: No state management library added
- **Design Review**: Using native localStorage, React hooks, crypto.randomUUID()
- **Final Bundle Impact**: ~2KB additional (date-fns only)
- **Status**: PASS - Design minimizes dependencies

### ✅ No Testing (NON-NEGOTIABLE)
- **Design Review**: No test files in project structure
- **Design Review**: Quickstart.md provides manual verification scenarios only
- **Design Review**: No test frameworks in dependencies
- **Status**: PASS - Design excludes all testing infrastructure

### ✅ Technology Stack
- **Design Review**: Uses Next.js 16.1.1 App Router ✓
- **Design Review**: React 19.2.3 with hooks ✓
- **Design Review**: Tailwind CSS 4.x with @theme directive ✓
- **Design Review**: TypeScript 5.x throughout ✓
- **Design Review**: No prohibited technologies ✓
- **Status**: PASS - Design adheres to technology requirements

**OVERALL POST-DESIGN STATUS**: ✅ ALL GATES PASSED - Ready for implementation

## Next Steps

**Planning Phase Complete** ✅

This plan document is now complete. Next command: `/speckit.tasks` to break down implementation into actionable tasks.

**Phase 0 Outputs Created**:
- ✅ [research.md](research.md) - Technology decisions and best practices
  
**Phase 1 Outputs Created**:
- ✅ [data-model.md](data-model.md) - Goal entity, TypeScript interfaces, state management
- ✅ [quickstart.md](quickstart.md) - 17 manual verification scenarios for browser testing

**Agent Context Updated**:
- ✅ `.github/agents/copilot-instructions.md` - Updated with TypeScript, Next.js, localStorage context

**Ready for**:
- Run `/speckit.tasks` to generate tasks.md with implementation checklist
- Tasks will be organized by user story priority (P1→P5) for incremental delivery

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
