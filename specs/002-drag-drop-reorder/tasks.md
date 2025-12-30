# Tasks: Drag and Drop Goal Reordering

**Input**: Design documents from `/specs/002-drag-drop-reorder/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Per project constitution, automated testing is PROHIBITED. All verification must be done manually through browser testing.

**Organization**: Tasks are grouped by user story to enable independent implementation and manual verification of each story.

## Format: `- [ ] [ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js app**: `app/`, `public/` at repository root
- All paths relative to project root: `c:\Users\liors.WISMAIN\spec_kit_course\`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and prepare project structure

- [ ] T001 Install sortablejs@1.15.3 and react-sortablejs@6.1.4 dependencies via npm
- [ ] T002 [P] Add order property to Goal interface in app/lib/types.ts
- [ ] T003 [P] Verify existing localStorage mechanism works with new order property

**Checkpoint**: Dependencies installed, Goal type updated, ready for implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data model and migration logic that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Implement migration logic in app/hooks/useGoals.tsx to add order property to existing goals
- [ ] T005 Update activeGoals sort logic in app/hooks/useGoals.tsx to sort by order property (ascending)
- [ ] T006 Update completedGoals sort logic in app/hooks/useGoals.tsx to sort by order property (ascending)
- [ ] T007 Add reorderGoals function in app/hooks/useGoals.tsx to handle goal reordering within status groups
- [ ] T008 Update addGoal function in app/hooks/useGoals.tsx to assign order = max(existing orders) + 1
- [ ] T009 Manual verification: Confirm existing goals get migrated with order values on first load

**Checkpoint**: Foundation ready - data model supports ordering, migration works, user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Goal Reordering (Priority: P1) 🎯 MVP

**Goal**: Enable mouse and touch drag-and-drop to reorder goals. Order persists across page refreshes.

**Manual Verification**: 
1. Open app in browser with 3+ active goals
2. Click and drag a goal to new position
3. Verify goal moves to new position and other goals shift
4. Refresh page and verify order persists
5. Repeat on mobile device using long-press (500ms) then drag
6. Verify completed goals can also be reordered independently

### Implementation for User Story 1

- [ ] T010 [P] [US1] Update GoalColumn component in app/components/GoalColumn.tsx to accept status and onReorder props
- [ ] T011 [P] [US1] Wrap GoalColumn children with ReactSortable component from react-sortablejs in app/components/GoalColumn.tsx
- [ ] T012 [US1] Configure ReactSortable with animation=150, delay=500 for touch, delayOnTouchOnly=true in app/components/GoalColumn.tsx
- [ ] T013 [US1] Implement onEnd callback in GoalColumn to call onReorder with old and new indices in app/components/GoalColumn.tsx
- [ ] T014 [US1] Update page.tsx to pass reorderGoals handler to ActiveGoals GoalColumn with status='active'
- [ ] T015 [US1] Update page.tsx to pass reorderGoals handler to CompletedGoals GoalColumn with status='completed'
- [ ] T016 [US1] Add cursor: grab/grabbing affordance styling to GoalCard component in app/components/GoalCard.tsx
- [ ] T017 [US1] Manual browser verification: Drag goals with mouse on desktop (Chrome, Firefox, Safari, Edge)
- [ ] T018 [US1] Manual browser verification: Long-press and drag goals on mobile/tablet devices
- [ ] T019 [US1] Manual browser verification: Confirm order persists after page refresh

**Checkpoint**: At this point, User Story 1 should be fully functional - users can reorder goals with mouse/touch and order persists

---

## Phase 4: User Story 2 - Visual Drag Feedback (Priority: P2)

**Goal**: Add visual feedback during drag: ghost element styling, drop position indicator line

**Manual Verification**:
1. Start dragging a goal
2. Verify dragged goal has distinct styling (opacity, slight rotation)
3. Verify original position shows ring indicator
4. Hover between two goals and verify horizontal blue line appears showing drop position
5. Drag outside list area and verify visual feedback indicates invalid drop

### Implementation for User Story 2

- [ ] T020 [P] [US2] Add ghostClass="opacity-50 bg-blue-100 rotate-2" to ReactSortable config in app/components/GoalColumn.tsx
- [ ] T021 [P] [US2] Add chosenClass="ring-2 ring-blue-500" to ReactSortable config in app/components/GoalColumn.tsx
- [ ] T022 [P] [US2] Add dragClass="shadow-2xl" to ReactSortable config in app/components/GoalColumn.tsx
- [ ] T023 [US2] Configure ReactSortable with forceFallback=true for consistent cross-browser behavior in app/components/GoalColumn.tsx
- [ ] T024 [US2] Add drop indicator line element with Tailwind classes (h-0.5 bg-blue-500) between goals during drag
- [ ] T025 [US2] Handle invalid drop areas - ensure goal returns to original position when dropped outside list
- [ ] T026 [US2] Manual browser verification: Confirm ghost element has correct styling during drag
- [ ] T027 [US2] Manual browser verification: Confirm horizontal line appears between goals on hover
- [ ] T028 [US2] Manual browser verification: Confirm visual feedback for invalid drop zones

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - full drag-and-drop with visual feedback

---

## Phase 5: User Story 3 - Cancel Drag Operation (Priority: P3)

**Goal**: Allow users to cancel drag via Escape key or by dropping at original position

**Manual Verification**:
1. Start dragging a goal
2. Press Escape key
3. Verify goal returns to original position and order unchanged
4. Start dragging a goal
5. Drag it around then drop back at original position
6. Verify no reordering occurs

### Implementation for User Story 3

- [ ] T029 [P] [US3] Add keyboard event listener for Escape key in GoalColumn component in app/components/GoalColumn.tsx
- [ ] T030 [US3] Implement Escape key handler to cancel drag and restore original order in app/components/GoalColumn.tsx
- [ ] T031 [US3] Add logic in onEnd callback to detect if dropped at original index in app/components/GoalColumn.tsx
- [ ] T032 [US3] Skip reordering if newIndex === oldIndex in onEnd callback
- [ ] T033 [US3] Manual browser verification: Press Escape during drag and confirm cancel works
- [ ] T034 [US3] Manual browser verification: Drop goal at original position and confirm no reorder occurs

**Checkpoint**: All P1, P2, and P3 user stories complete - users can reorder with visual feedback and cancel operations

---

## Phase 6: Keyboard Navigation (Priority: P2) - Enhancement

**Goal**: Support full keyboard navigation (Tab, Space/Enter, Arrow keys) for accessibility

**Manual Verification**:
1. Tab to focus on a goal card
2. Press Space or Enter to enter "grab mode"
3. Press Arrow Up/Down to move goal position
4. Press Space/Enter again to commit new position
5. Press Escape to cancel
6. Verify works with screen reader

### Implementation for Keyboard Navigation

- [ ] T035 [P] [US2] Add tabIndex={0} to GoalCard component for keyboard focus in app/components/GoalCard.tsx
- [ ] T036 [P] [US2] Add isGrabMode state to GoalCard component in app/components/GoalCard.tsx
- [ ] T037 [US2] Implement onKeyDown handler in GoalCard for Space/Enter to toggle grab mode in app/components/GoalCard.tsx
- [ ] T038 [US2] Add visual indicator (ring-4 ring-blue-500) when goal is in grab mode in app/components/GoalCard.tsx
- [ ] T039 [US2] Add Arrow Up handler to call onMoveUp callback prop in app/components/GoalCard.tsx
- [ ] T040 [US2] Add Arrow Down handler to call onMoveDown callback prop in app/components/GoalCard.tsx
- [ ] T041 [US2] Add Escape handler to exit grab mode without changes in app/components/GoalCard.tsx
- [ ] T042 [US2] Implement onMoveUp function in useGoals hook to move goal up one position in app/hooks/useGoals.tsx
- [ ] T043 [US2] Implement onMoveDown function in useGoals hook to move goal down one position in app/hooks/useGoals.tsx
- [ ] T044 [US2] Pass onMoveUp and onMoveDown handlers from page.tsx to GoalCard components
- [ ] T045 [US2] Add aria-live region for screen reader announcements of reorder actions in app/components/GoalColumn.tsx
- [ ] T046 [US2] Add aria-label to GoalCard describing current position and grab mode state in app/components/GoalCard.tsx
- [ ] T047 [US2] Manual browser verification: Tab through goals and verify focus indicators visible
- [ ] T048 [US2] Manual browser verification: Use keyboard to reorder goals (Space/Arrow/Enter flow)
- [ ] T049 [US2] Manual browser verification: Test with screen reader (NVDA/JAWS/VoiceOver)

**Checkpoint**: Full keyboard accessibility implemented - feature usable without mouse/touch

---

## Phase 7: Auto-Scroll (Priority: P2) - Enhancement

**Goal**: Enable auto-scroll when dragging near top/bottom edges for long goal lists

**Manual Verification**:
1. Create 20+ goals to exceed viewport height
2. Drag a goal from top towards bottom
3. Verify page auto-scrolls down when drag reaches bottom edge
4. Drag from bottom towards top
5. Verify page auto-scrolls up when drag reaches top edge

### Implementation for Auto-Scroll

- [ ] T050 [US2] Configure ReactSortable with scroll option enabled in app/components/GoalColumn.tsx
- [ ] T051 [US2] Set scrollSensitivity to 100 pixels from edge in ReactSortable config
- [ ] T052 [US2] Set scrollSpeed to 10 for smooth auto-scroll in ReactSortable config
- [ ] T053 [US2] Ensure scroll container is properly identified (window or parent element)
- [ ] T054 [US2] Manual browser verification: Create 30 goals and test auto-scroll during drag
- [ ] T055 [US2] Manual browser verification: Test auto-scroll on mobile devices with long lists

**Checkpoint**: Auto-scroll working - users can reorder across long goal lists seamlessly

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [ ] T056 [P] Add React.memo to GoalCard component to prevent unnecessary re-renders during drag in app/components/GoalCard.tsx
- [ ] T057 [P] Add haptic feedback (vibration) on touch devices when long-press activates in app/components/GoalColumn.tsx
- [ ] T058 [P] Verify performance with 100 goals - ensure smooth drag without lag
- [ ] T059 [P] Add console error handling for edge cases (missing order property, invalid indices)
- [ ] T060 Test migration with various edge cases (empty goals array, goals missing properties)
- [ ] T061 Code review: Ensure all Tailwind classes are responsive (mobile, tablet, desktop)
- [ ] T062 Run through quickstart.md validation checklist
- [ ] T063 Final cross-browser testing: Chrome, Firefox, Safari, Edge (desktop + mobile)
- [ ] T064 Final accessibility audit with keyboard-only navigation and screen reader
- [ ] T065 Performance validation: Test with 50 goals, then 100 goals, measure drag latency

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion (builds on drag functionality)
- **User Story 3 (Phase 5)**: Depends on User Story 1 completion (adds cancellation to drag)
- **Keyboard Navigation (Phase 6)**: Depends on Foundational phase - can run parallel to US1 if desired
- **Auto-Scroll (Phase 7)**: Depends on US1 completion (enhances existing drag)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories ✅ MVP
- **User Story 2 (P2)**: Depends on User Story 1 - Adds visual feedback to existing drag functionality
- **User Story 3 (P3)**: Depends on User Story 1 - Adds cancellation to existing drag functionality
- **Keyboard (P2)**: Can start after Foundational (Phase 2) - Independent enhancement
- **Auto-Scroll (P2)**: Depends on User Story 1 - Enhances long list dragging

### Within Each Phase

**Phase 3 (User Story 1)**:
1. T010, T011 can run in parallel (different concepts)
2. T012 depends on T011 (configuring ReactSortable)
3. T013 depends on T012 (adding callbacks)
4. T014, T015, T016 can run in parallel after T013
5. T017-T019 are manual verification (sequential)

**Phase 4 (User Story 2)**:
1. T020, T021, T022 can run in parallel (styling config)
2. T023, T024, T025 can run after styling config
3. T026-T028 are manual verification

**Phase 5 (User Story 3)**:
1. T029, T030 can be done together (Escape handler)
2. T031, T032 can be done together (original position detection)
3. T033-T034 are manual verification

**Phase 6 (Keyboard)**:
1. T035, T036, T037 foundational setup can run in parallel
2. T038-T041 handlers can run in parallel after setup
3. T042-T044 hook integration depends on handlers
4. T045-T046 accessibility can run in parallel
5. T047-T049 manual verification

### Parallel Opportunities

- **After Setup**: Foundational tasks T004-T008 can be grouped (all in useGoals.tsx)
- **Within US1**: T010-T011 parallel, then T014-T016 parallel
- **Within US2**: T020-T022 parallel styling config
- **Within US3**: T029-T030 parallel, T031-T032 parallel
- **Within Keyboard**: T035-T037 parallel, T038-T041 parallel, T042-T043 parallel
- **Within Auto-Scroll**: T050-T053 all in same config (sequential but quick)
- **Polish Phase**: T056-T059 can all run in parallel (different files/concerns)

---

## Parallel Execution Example: User Story 1

```bash
# Step 1: Update type and column component in parallel
Task T010: "Update GoalColumn component props" (app/components/GoalColumn.tsx)
Task T011: "Wrap children with ReactSortable" (app/components/GoalColumn.tsx)

# Step 2: Configure ReactSortable (depends on T011)
Task T012: "Configure ReactSortable options"

# Step 3: Add callback (depends on T012)
Task T013: "Implement onEnd callback"

# Step 4: Wire up page and add styling in parallel (depends on T013)
Task T014: "Update page.tsx active goals column"
Task T015: "Update page.tsx completed goals column"  
Task T016: "Add cursor styling to GoalCard"

# Step 5: Manual verification (sequential)
Task T017: "Desktop browser testing"
Task T018: "Mobile device testing"
Task T019: "Persistence verification"
```

---

## Implementation Strategy

### MVP First (Minimum Viable Product)

**Phase 3 (User Story 1) = MVP**: Basic mouse/touch drag-and-drop with persistence

This delivers core value and can be deployed independently. All other phases are enhancements.

### Incremental Delivery

1. **Sprint 1**: Setup + Foundational + User Story 1 (MVP) - ~2-3 days
2. **Sprint 2**: User Story 2 (Visual Feedback) + User Story 3 (Cancel) - ~1-2 days
3. **Sprint 3**: Keyboard Navigation + Auto-Scroll - ~2-3 days
4. **Sprint 4**: Polish & Performance - ~1 day

### Task Estimation

- **Setup**: 30 minutes
- **Foundational**: 2-3 hours
- **User Story 1**: 4-6 hours
- **User Story 2**: 2-3 hours
- **User Story 3**: 1-2 hours
- **Keyboard Navigation**: 4-6 hours
- **Auto-Scroll**: 1-2 hours
- **Polish**: 2-3 hours

**Total**: ~20-30 hours for complete feature with all enhancements

### Success Metrics

- ✅ All 3 user stories independently verifiable
- ✅ Order persists across page refreshes (SC-002)
- ✅ Works on desktop (mouse) and mobile (touch) (SC-005)
- ✅ Visual feedback appears within 100ms (SC-003)
- ✅ Reorder completes within 5 seconds (SC-001)
- ✅ Supports 100 goals without lag (SC-007)
- ✅ Keyboard accessible (FR-009)
- ✅ Auto-scroll enabled (FR-014)
- ✅ Cancel operations work (SC-006)

---

## Notes

- **No Testing Files**: Per constitution, no test files or test frameworks. All verification is manual.
- **Tailwind Only**: All styling uses Tailwind CSS utility classes, no custom CSS files.
- **TypeScript**: All new code must use TypeScript with proper types.
- **Responsive**: All features must work on mobile, tablet, and desktop viewports.
- **Accessibility**: Keyboard navigation and screen reader support are required (FR-009).
- **Performance**: Must handle 100 goals smoothly (SC-007).
