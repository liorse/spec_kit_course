# Quickstart: DoIt Goal Tracking App

**Created**: 2025-12-30  
**Feature**: [spec.md](spec.md)  
**Purpose**: Manual verification scenarios for browser testing

## Development Setup

### Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager

### Installation

```bash
# Navigate to project root
cd c:\Users\liors.WISMAIN\spec_kit_course

# Install dependencies (including shadcn, date-fns, tailwind)
npm install

# Initialize shadcn/ui
npx shadcn@latest init

# Add required shadcn components
npx shadcn@latest add dialog
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label

# Install date-fns
npm install date-fns

# Start development server
npm run dev
```

### Access Application
Open browser to `http://localhost:3000`

---

## Manual Verification Scenarios

### Scenario 1: First-Time User Experience (Empty State)

**User Story**: P1 - View and Organize Goals

**Steps**:
1. Open application in fresh browser (or clear localStorage)
2. Observe the page layout

**Expected Results**:
- ✅ Two-column layout visible (Active Goals | Completed Goals)
- ✅ Active Goals column shows empty state message: "No active goals yet. Click the + button to add your first goal!"
- ✅ Completed Goals column shows empty state: "No completed goals yet."
- ✅ Floating "+" or "Add Goal" button visible in bottom-right or top-right
- ✅ Page uses light pastel color theme
- ✅ Layout is responsive (resize browser window to test mobile/tablet/desktop)

**Viewports to Test**:
- Mobile: 375px × 667px (iPhone SE)
- Tablet: 768px × 1024px (iPad)
- Desktop: 1920px × 1080px

---

### Scenario 2: Add First Goal

**User Story**: P2 - Add New Goals

**Steps**:
1. Click "Add Goal" button
2. Observe modal opens
3. Leave title empty, try to submit
4. Enter title: "Complete project documentation"
5. Select end date: Tomorrow's date
6. Click Submit/Save button

**Expected Results**:
- ✅ Modal dialog opens with darkened overlay
- ✅ Modal contains "Title" input field and "End Date" date picker
- ✅ Empty submission shows validation error: "Title is required"
- ✅ After filling form, modal closes on submit
- ✅ New goal appears in Active Goals column
- ✅ Goal shows title and "X days left" (where X is days until tomorrow)
- ✅ Goal appears as a card with checkbox
- ✅ Page remains responsive after adding goal

**Accessibility Check**:
- Tab through form fields (should work without mouse)
- Press Escape key (should close modal)
- Click outside modal (should close without saving)

---

### Scenario 3: Add Multiple Goals with Different Deadlines

**User Story**: P1 - View and Organize Goals (Sorting)

**Steps**:
1. Add goal "Task A" with end date: 7 days from now
2. Add goal "Task B" with end date: 2 days from now (urgent)
3. Add goal "Task C" with end date: 30 days from now
4. Add goal "Task D" with end date: Yesterday (test overdue)

**Expected Results**:
- ✅ Goals are sorted by deadline (soonest first)
- ✅ Order in Active column: Task D (overdue), Task B (2 days), Task A (7 days), Task C (30 days)
- ✅ Each goal shows correct days remaining
- ✅ Overdue goal (Task D) shows "Overdue" text instead of negative days
- ✅ All goals display consistently in card format

---

### Scenario 4: Urgency Highlighting

**User Story**: P4 - Deadline Urgency Highlighting

**Using goals from Scenario 3**:

**Expected Results**:
- ✅ Task D (overdue): Maximum urgency highlighting (e.g., red pastel border/background)
- ✅ Task B (2 days): Urgent highlighting (e.g., yellow pastel border/background)
- ✅ Task A (7 days): Normal styling
- ✅ Task C (30 days): Normal styling
- ✅ Highlighting is visible and distinguishable
- ✅ Color contrast meets readability standards

---

### Scenario 5: Complete a Goal

**User Story**: P3 - Complete or Delete Goals

**Steps**:
1. Click checkbox on "Task A" (7 days remaining)
2. Observe action buttons appear
3. Click "Complete" button
4. Observe goal transition

**Expected Results**:
- ✅ Checkbox click reveals inline action buttons (Complete / Delete)
- ✅ Action buttons appear beside the goal (not in modal)
- ✅ Clicking "Complete" moves goal to Completed Goals column
- ✅ Completed goal shows title but no countdown timer
- ✅ Completed goal appears at top of Completed column (most recent first)
- ✅ Smooth animation during transition
- ✅ Active Goals column updates without full page refresh

---

### Scenario 6: Overdue Goal Cannot Be Completed

**User Story**: P3 - Complete or Delete Goals (Overdue Handling)

**Steps**:
1. Click checkbox on "Task D" (overdue goal)
2. Observe action buttons

**Expected Results**:
- ✅ Only "Delete" button appears (no "Complete" button)
- ✅ Cannot complete an overdue goal
- ✅ Visual indication that goal is overdue (urgent highlighting)

---

### Scenario 7: Delete Active Goal

**User Story**: P3 - Complete or Delete Goals

**Steps**:
1. Click checkbox on "Task C" (30 days goal)
2. Click "Delete" button
3. Observe goal removal

**Expected Results**:
- ✅ Action buttons appear (Complete / Delete)
- ✅ Clicking "Delete" removes goal from Active column
- ✅ Goal does not appear in Completed column
- ✅ Smooth removal animation
- ✅ If it was the last active goal, empty state appears

---

### Scenario 8: Uncomplete a Goal

**User Story**: P3 - Complete or Delete Goals (Uncomplete)

**Steps**:
1. Click on or activate completed "Task A" in Completed column
2. Observe action buttons appear
3. Click "Uncomplete" button
4. Observe goal transition

**Expected Results**:
- ✅ Completed goal can be clicked/selected
- ✅ Action buttons appear: "Uncomplete / Delete"
- ✅ Clicking "Uncomplete" moves goal back to Active column
- ✅ Goal retains original end date (7 days from original, not from today)
- ✅ Goal reappears with countdown timer
- ✅ Goal is re-sorted by deadline in Active column
- ✅ Smooth transition animation

---

### Scenario 9: Delete Completed Goal

**User Story**: P3 - Complete or Delete Goals

**Steps**:
1. Click on a completed goal
2. Click "Delete" button

**Expected Results**:
- ✅ Goal is permanently removed from Completed column
- ✅ No confirmation dialog (or optional: shows confirmation)
- ✅ Smooth removal animation
- ✅ If last completed goal, empty state appears

---

### Scenario 10: Persistence Across Sessions

**User Story**: P1 - View and Organize Goals (Persistence)

**Steps**:
1. Ensure you have several goals (active and completed)
2. Note the exact state: titles, dates, counts
3. Close browser tab
4. Reopen application in new tab/window
5. Observe restored state

**Expected Results**:
- ✅ All goals reappear exactly as left
- ✅ Active goals in correct order by deadline
- ✅ Completed goals in correct order by completion date
- ✅ Countdown timers show correct days remaining
- ✅ Urgency highlighting applied correctly
- ✅ No data loss

---

### Scenario 11: Form Validation

**User Story**: P2 - Add New Goals (Validation)

**Steps**:
1. Open Add Goal modal
2. Try to submit with empty title
3. Enter title, leave date empty, try submit
4. Enter title, select yesterday's date, try submit
5. Enter title, select today's date, try submit
6. Enter title, select tomorrow's date, submit

**Expected Results**:
- ✅ Empty title: Shows error "Title is required", prevents submission
- ✅ Empty date: Shows error "End date is required", prevents submission
- ✅ Past date: Shows error "End date cannot be in the past", prevents submission
- ✅ Today's date: Allows submission (0 days remaining)
- ✅ Future date: Allows submission
- ✅ Error messages appear below respective fields
- ✅ Error messages are human-readable

---

### Scenario 12: Modal Interactions

**User Story**: P2 - Add New Goals (Modal UX)

**Steps**:
1. Open Add Goal modal
2. Press Escape key
3. Reopen modal, fill in partial data
4. Click outside modal (on overlay)
5. Reopen modal, complete form, click submit

**Expected Results**:
- ✅ Escape key closes modal without saving
- ✅ Clicking outside closes modal without saving
- ✅ Partial data is lost when modal closes (no autosave)
- ✅ Submit button closes modal and saves goal
- ✅ Modal focuses on title input when opened (accessibility)

---

### Scenario 13: Responsive Design

**User Story**: P5 - Pastel Theme Visual Design (Responsive)

**Steps**:
1. Open app in desktop browser (1920px wide)
2. Resize to tablet width (768px)
3. Resize to mobile width (375px)
4. Test all features at each breakpoint

**Expected Results**:

**Desktop (>1024px)**:
- ✅ Two columns side-by-side (50/50 split)
- ✅ Comfortable whitespace and padding
- ✅ Modal centered, reasonable width (~500px)

**Tablet (768px-1024px)**:
- ✅ Two columns side-by-side with smaller gap
- ✅ Modal adapts to available width
- ✅ Touch targets remain 44x44px minimum

**Mobile (<768px)**:
- ✅ Columns stack vertically (Active on top, Completed below)
- ✅ Full-width goal cards
- ✅ Modal fills most of screen width
- ✅ Add Goal button positioned for thumb reach
- ✅ Text remains readable without horizontal scroll
- ✅ Date picker works on touch screens

---

### Scenario 14: Long Goal Titles

**User Story**: P1 - View and Organize Goals (Edge Case)

**Steps**:
1. Add goal with very long title (150+ characters)
2. Add goal with single word title
3. Observe layout

**Expected Results**:
- ✅ Long titles wrap to multiple lines or truncate with ellipsis
- ✅ Goal card height adjusts to content
- ✅ Layout doesn't break
- ✅ Title remains readable
- ✅ Action buttons remain accessible

---

### Scenario 15: Many Goals Performance

**User Story**: P1 - View and Organize Goals (Performance)

**Steps**:
1. Add 20-30 goals (can use browser console or quick clicks)
2. Scroll through Active column
3. Complete several goals
4. Test interactions

**Expected Results**:
- ✅ Page remains responsive with 20+ goals
- ✅ Scrolling is smooth (no jank)
- ✅ Columns independently scrollable
- ✅ Actions still work instantly
- ✅ No performance degradation

---

### Scenario 16: Pastel Theme Verification

**User Story**: P5 - Pastel Theme Visual Design

**Steps**:
1. Observe overall color scheme
2. Check background colors
3. Check button colors
4. Check goal card colors by state

**Expected Results**:
- ✅ Overall background is light (off-white or very light gray)
- ✅ Goal cards use soft pastel colors
- ✅ Buttons use pastel shades (not bright/harsh colors)
- ✅ Urgent goals use distinguishable but still pastel warning color
- ✅ Completed goals use different pastel shade than active
- ✅ Text has sufficient contrast for readability (4.5:1 minimum)
- ✅ Theme is consistent across all components
- ✅ Colors are pleasant and motivating (subjective but important)

---

### Scenario 17: Browser localStorage Limits

**User Story**: P1 - View and Organize Goals (Storage Edge Case)

**Steps**:
1. Open browser DevTools → Application tab → Local Storage
2. Find "doit-goals" key
3. Observe stored JSON
4. Clear localStorage: `localStorage.clear()`
5. Refresh page

**Expected Results**:
- ✅ Goals array visible in localStorage as JSON
- ✅ Data structure matches Goal interface
- ✅ After clearing and refresh, app shows empty state
- ✅ No errors in console
- ✅ App gracefully handles missing data

---

## Cross-Browser Testing Checklist

Test on multiple browsers to ensure compatibility:

- [ ] **Chrome/Edge** (Chromium): Primary testing browser
- [ ] **Firefox**: Test date picker, localStorage
- [ ] **Safari** (macOS/iOS): Test date picker, animations
- [ ] **Mobile Safari** (iOS): Touch interactions, viewport
- [ ] **Chrome Mobile** (Android): Touch interactions, viewport

---

## Verification Checklist Summary

### User Story P1: View and Organize Goals
- [ ] Empty state displays correctly
- [ ] Goals appear in columns
- [ ] Days remaining calculated correctly
- [ ] Sorting works (by deadline for active, by completion date for completed)
- [ ] Persistence works across sessions

### User Story P2: Add New Goals
- [ ] Modal opens and closes correctly
- [ ] Form validation works
- [ ] New goals appear immediately
- [ ] ESC and click-outside close modal

### User Story P3: Complete or Delete Goals
- [ ] Checkbox shows inline action buttons
- [ ] Complete moves goal to completed column
- [ ] Delete removes goal permanently
- [ ] Uncomplete moves goal back to active
- [ ] Overdue goals show only Delete button

### User Story P4: Deadline Urgency Highlighting
- [ ] Overdue goals highlighted (maximum urgency)
- [ ] 0-3 days goals highlighted (urgent)
- [ ] 4+ days goals normal styling

### User Story P5: Pastel Theme Visual Design
- [ ] Light background with pastel colors
- [ ] Consistent theme across components
- [ ] Good contrast for readability
- [ ] Pleasant, motivating design

### Constitutional Requirements
- [ ] Responsive on mobile/tablet/desktop
- [ ] Clean, readable code structure
- [ ] Simple, intuitive UX
- [ ] No testing frameworks present
- [ ] Minimal dependencies (shadcn, date-fns only)

---

## Troubleshooting Common Issues

### Issue: Modal doesn't close on ESC
- Check: shadcn Dialog component props
- Verify: onOpenChange handler

### Issue: Goals not persisting
- Check: Browser DevTools → Application → Local Storage
- Verify: localStorage.setItem is called in useEffect
- Check: No errors in console

### Issue: Dates showing wrong days remaining
- Check: Timezone handling in date-fns
- Verify: Using correct functions (differenceInDays)
- Check: Date format is ISO 8601

### Issue: Layout broken on mobile
- Check: Tailwind responsive classes (md:, lg:)
- Verify: flex-col stacking on small screens
- Check: Viewport meta tag in layout.tsx

### Issue: Colors not matching theme
- Check: tailwind.config.ts @theme configuration
- Verify: globals.css has @theme directive
- Check: Component className uses theme colors
