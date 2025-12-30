# Implementation Plan: Drag and Drop Goal Reordering

**Branch**: `002-drag-drop-reorder` | **Date**: December 30, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-drag-drop-reorder/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add drag-and-drop functionality to reorder goals within active and completed lists. Users can click-and-drag (mouse), long-press-and-drag (touch), or use keyboard navigation (Tab/Space/Arrows) to rearrange goals. Order persists across sessions via localStorage. Implementation uses SortableJS library for cross-platform drag support and Tailwind CSS for visual feedback styling. No testing required per constitution.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 16.1.1 and React 19.2.3  
**Primary Dependencies**: 
- Next.js 16.1.1 (existing)
- React 19.2.3 (existing)
- Tailwind CSS 4.x (existing)
- **NEW**: sortablejs@1.15.3 (drag-and-drop library)
- **NEW**: react-sortablejs@6.1.4 (React wrapper)

**Storage**: Browser localStorage (existing mechanism - key: 'doit-goals')  
**Target Platform**: Web browsers - Chrome, Firefox, Safari, Edge (desktop + mobile)  
**Project Type**: Next.js web application with App Router  
**Performance Goals**: 
- Support 100 goals without lag (SC-007)
- Visual feedback within 100ms of drag start (SC-003)
- Reorder operation completes within 5 seconds (SC-001)

**Constraints**: 
- Must work with mouse, touch, and keyboard input (FR-008, FR-009)
- Auto-scroll required for long lists (FR-014)
- Order must persist across page refreshes (FR-006)
- No testing frameworks (per constitution)

**Scale/Scope**: 
- Single-user application
- Up to 100 goals per list
- Two separate sortable lists (active, completed)
- 4 files modified, ~300 lines of code added

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **Clean Code First** | ✅ PASS | SortableJS provides clean API, minimal custom logic needed. Order property adds clarity to data model. |
| **Simple UX** | ✅ PASS | Drag-and-drop is intuitive, matches user expectations. Long-press on touch prevents accidental drags. |
| **Responsive Design** | ✅ PASS | Works on mobile (touch), tablet (touch), desktop (mouse). Auto-scroll supports all viewports. |
| **Minimal Dependencies** | ⚠️ JUSTIFIED | Adding 2 packages (sortablejs + wrapper) totaling ~25KB. Justified: Custom implementation would require 500+ lines for mouse/touch/keyboard/auto-scroll support. Library is battle-tested and actively maintained. |
| **No Testing** | ✅ PASS | No test files or frameworks. Manual browser verification only. |
| **Required Tech Stack** | ✅ PASS | Next.js 16.1.1 ✓, React 19.2.3 ✓, Tailwind CSS 4.x ✓, TypeScript 5.x ✓ |
| **Prohibited Tech** | ✅ PASS | No testing frameworks, no CSS-in-JS, no state libraries, no UI component libraries |

**Pre-Phase 0 Verdict**: ✅ **PROCEED** - One justified dependency violation, all other principles satisfied.

**Post-Phase 1 Verdict**: ✅ **PROCEED** - Design confirms minimal complexity, clean interfaces, responsive patterns.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── page.tsx                    # MODIFIED: Add reorder handlers to GoalColumn components
├── components/
│   ├── GoalColumn.tsx          # MODIFIED: Wrap with ReactSortable, add reorder callback
│   └── GoalCard.tsx            # MODIFIED: Add keyboard navigation handlers (optional Phase 3)
├── hooks/
│   └── useGoals.tsx            # MODIFIED: Add migration logic + reorderGoals function
└── lib/
    └── types.ts                # MODIFIED: Add order: number to Goal interface

package.json                    # MODIFIED: Add sortablejs + react-sortablejs dependencies

specs/002-drag-drop-reorder/    # Documentation artifacts
├── spec.md                     # Feature specification
├── plan.md                     # This file
├── research.md                 # Technology decisions
├── data-model.md               # Data structure changes
└── quickstart.md               # Developer implementation guide
```

**Structure Decision**: Next.js App Router structure (default for this project). All modifications are in existing files with two new dependencies. No new components or routes needed for basic functionality.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Two new dependencies (sortablejs, react-sortablejs) | Implementing drag-and-drop from scratch requires handling: mouse events, touch events with long-press detection, keyboard navigation, auto-scroll on viewport edges, ghost element rendering, drop position indicators, and cross-browser compatibility. Estimated 500+ lines of complex event handling code. | Custom implementation would violate "Clean Code First" (excessive complexity), take 10x longer to implement, introduce bugs in edge cases (touch scrolling conflicts, keyboard accessibility), and require ongoing maintenance for browser compatibility. SortableJS is battle-tested by Trello, Asana, and thousands of production apps with 25K+ GitHub stars and active maintenance. |
