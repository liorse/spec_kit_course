# Feature Specification: DoIt Goal Tracking App

**Feature Branch**: `001-doit-app`  
**Created**: 2025-12-30  
**Status**: Draft  
**Input**: User description: "initial page setup - this application should be a goal tracking web app called 'doit'. There should be two columns - a left one where current goals are shown, along with how many days left the user has to achieve the goal, and right one where completed goals are. Each goal can be 'checked' using a checkbox, and then either moved to the completed column or permanently deleted. To add new goals, a user can click on a button to open a new goal form in a modal (title and end date fields). Goal reaching their end date (within 3 days) are highlighted. Let's use a modern light theme with fun pastel colours."

## User Scenarios *(mandatory)*

### User Story 1 - View and Organize Goals (Priority: P1)

Users can see all their active goals in a clear left column, with each goal displaying its title and how many days remain until the deadline. This provides immediate visual feedback on what needs attention and helps users prioritize their efforts.

**Why this priority**: This is the core value proposition - users need to see their goals and track time remaining. Without this, the app has no purpose.

**Independent Verification**: Can be manually verified by loading the app and observing that existing goals appear in the left column with their titles and countdown timers. Delivers immediate value by showing goal status at a glance.

**Acceptance Scenarios**:

1. **Given** the app loads with existing goals, **When** user views the page, **Then** all active goals appear in the left column with their titles visible
2. **Given** a goal has a deadline set, **When** user views the goal, **Then** the number of days remaining is displayed next to or below the title
3. **Given** multiple goals exist, **When** user views the left column, **Then** all goals are displayed in a vertically stacked list
4. **Given** no goals exist, **When** user views the page, **Then** the left column displays an appropriate empty state message

---

### User Story 2 - Add New Goals (Priority: P2)

Users can create new goals by clicking an "Add Goal" button which opens a modal form. The form collects the goal title and end date, making it quick and intuitive to capture new objectives.

**Why this priority**: Users need to add goals to make the app useful, but viewing existing goals (P1) demonstrates the core interface. This is the second most critical feature for a functional MVP.

**Independent Verification**: Can be manually verified by clicking the add button, filling in the form with a title and date, submitting, and seeing the new goal appear in the active goals column.

**Acceptance Scenarios**:

1. **Given** user is viewing the main page, **When** user clicks the "Add Goal" button, **Then** a modal overlay opens with a form
2. **Given** the add goal modal is open, **When** user views the form, **Then** it contains a title input field and an end date picker
3. **Given** user has filled in both title and end date, **When** user submits the form, **Then** the modal closes and the new goal appears in the active goals column
4. **Given** user has the modal open, **When** user clicks outside the modal or on a cancel/close button, **Then** the modal closes without saving
5. **Given** user tries to submit with empty title, **When** user clicks submit, **Then** form shows validation error and prevents submission

---

### User Story 3 - Complete or Delete Goals (Priority: P3)

Users can mark goals as complete using a checkbox, which moves them to the completed column. Alternatively, users can permanently delete goals they no longer want to track.

**Why this priority**: Completing goals is satisfying and important, but requires P1 (viewing) and P2 (adding) to be useful. This completes the basic goal lifecycle.

**Independent Verification**: Can be manually verified by checking a goal's checkbox and seeing it move to the right column, or by deleting a goal and confirming it's removed from the app.

**Acceptance Scenarios**:

1. **Given** an active goal exists, **When** user checks the goal's checkbox, **Then** a confirmation or action choice appears (move to completed or delete)
2. **Given** user chooses to complete the goal, **When** the action is confirmed, **Then** the goal moves from the left column to the right "Completed" column
3. **Given** user chooses to delete the goal, **When** the action is confirmed, **Then** the goal is permanently removed from both columns
4. **Given** a goal is in the completed column, **When** user views it, **Then** it displays with the same title but without the countdown timer
5. **Given** multiple goals are completed, **When** user views the right column, **Then** all completed goals are visible in a list

---

### User Story 4 - Deadline Urgency Highlighting (Priority: P4)

Goals that are within 3 days of their deadline are visually highlighted with a distinct color or indicator, helping users identify which goals need immediate attention.

**Why this priority**: This enhances usability but the app functions without it. Users can manually check days remaining, making this a nice-to-have polish feature.

**Independent Verification**: Can be manually verified by creating goals with various deadlines and observing that goals within 3 days show visual highlighting while others don't.

**Acceptance Scenarios**:

1. **Given** a goal has 3 or fewer days remaining, **When** user views the active goals, **Then** that goal displays with a highlighted background or border color
2. **Given** a goal has 4 or more days remaining, **When** user views the active goals, **Then** that goal displays with the normal background color
3. **Given** a goal reaches the 3-day threshold, **When** the day changes or page refreshes, **Then** the highlighting appears automatically
4. **Given** a goal's deadline is today or past, **When** user views the goal, **Then** it shows maximum urgency highlighting

---

### User Story 5 - Pastel Theme Visual Design (Priority: P5)

The application uses a modern light theme with fun pastel colors throughout the interface, creating a pleasant and motivating user experience.

**Why this priority**: Visual polish is important for user satisfaction but not critical for functionality. All features work regardless of color scheme.

**Independent Verification**: Can be manually verified by loading the app on different devices and confirming the color scheme is consistently light and pastel-based with good contrast.

**Acceptance Scenarios**:

1. **Given** user loads the app, **When** viewing the interface, **Then** the overall background uses light, soft colors
2. **Given** the app displays UI elements, **When** user views buttons and interactive elements, **Then** they use pastel color variations
3. **Given** user views the app on mobile and desktop, **When** checking the design, **Then** the pastel theme is consistent across devices
4. **Given** goals are displayed, **When** user views them, **Then** different goal states use distinct but complementary pastel shades

### Edge Cases

- What happens when a goal's end date is in the past? (Display "Overdue" or negative days?)
- What happens when user tries to set an end date in the past? (Validation should prevent this)
- What happens when user has many goals (50+)? (Column should scroll, maintain performance)
- What happens when goal title is very long? (Text should wrap or truncate with ellipsis)
- What happens if user's browser doesn't support the date picker? (Fallback to text input with format guidance)
- What happens when user clicks outside modal while entering data? (Could confirm unsaved changes or close without saving per UX patterns)
- What happens when completed goals column becomes full? (Should scroll independently)
- What happens on very small mobile screens (< 320px)? (Columns might stack vertically)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display active goals in a left column showing goal title and days remaining until deadline
- **FR-002**: System MUST display completed goals in a right column showing goal title without countdown
- **FR-003**: System MUST calculate and display days remaining dynamically based on current date and goal deadline
- **FR-004**: System MUST provide an "Add Goal" button that opens a modal form overlay
- **FR-005**: System MUST collect goal title (text input) and end date (date picker) in the add goal form
- **FR-006**: System MUST validate that goal title is not empty before allowing submission
- **FR-007**: System MUST validate that end date is selected before allowing submission
- **FR-008**: System MUST prevent users from selecting past dates for new goals
- **FR-009**: System MUST add newly created goals to the active goals column immediately after submission
- **FR-010**: System MUST provide a checkbox or similar control for each active goal
- **FR-011**: System MUST provide options to either complete or delete a goal when checkbox is activated
- **FR-012**: System MUST move goals to the completed column when user selects "complete" action
- **FR-013**: System MUST permanently remove goals when user selects "delete" action
- **FR-014**: System MUST visually highlight goals that have 3 or fewer days remaining until deadline
- **FR-015**: System MUST persist goals in browser storage so they survive page refreshes
- **FR-016**: System MUST use a light theme with pastel color palette throughout the interface
- **FR-017**: System MUST be responsive and functional on mobile, tablet, and desktop screen sizes
- **FR-018**: System MUST allow modal to be closed without saving (cancel action)
- **FR-019**: System MUST provide clear visual feedback when goals transition between states
- **FR-020**: System MUST handle empty states appropriately (no active goals, no completed goals)

### Key Entities

- **Goal**: Represents a user's objective to achieve by a specific date
  - Title: User-defined text describing what to accomplish
  - End Date: Target deadline for completion
  - Status: Active or Completed (deleted goals don't persist)
  - Created Date: When the goal was added (implicit)
  - Days Remaining: Calculated value based on end date and current date

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a new goal in under 15 seconds from clicking the button to seeing it in the list
- **SC-002**: Users can complete or delete a goal with no more than 2 clicks
- **SC-003**: Goal countdown updates are visible immediately without page refresh
- **SC-004**: Application loads and displays goals within 2 seconds on standard broadband connection
- **SC-005**: Interface remains usable and readable on screens from 320px mobile to 4K desktop
- **SC-006**: Users can distinguish between active and completed goals at a glance from 2 feet away
- **SC-007**: Urgent goals (3 days or less) are immediately identifiable without reading the days remaining text
- **SC-008**: Modal form can be completed using only keyboard navigation (accessibility)
- **SC-009**: 95% of users successfully create their first goal without external help
- **SC-010**: Goals persist across browser sessions with 100% reliability

## Assumptions

- Goals are stored locally in browser (localStorage or similar) - no backend/account system required
- User timezone is automatically detected from browser for date calculations
- Only one user per browser - no multi-user support needed
- Goals are personal and not shared with other users
- Date calculations assume midnight as the cutoff time for day transitions
- Browser supports ES6+ JavaScript features and modern CSS
- Modal overlay darkens background to focus attention on form
- Deletion is permanent with no undo feature (could add confirmation dialog)
- Completed goals remain indefinitely unless manually deleted from completed column
- Goal titles have reasonable length limit (e.g., 100-200 characters)

## Out of Scope

- User authentication or accounts
- Backend server or database
- Sharing goals with others
- Goal categories or tags
- Goal priority levels beyond urgency highlighting
- Recurring goals
- Goal reminders or notifications
- Goal progress tracking (partial completion)
- Goal notes or descriptions beyond title
- Goal history or analytics
- Export/import functionality
- Dark mode or theme customization
- Undo/redo functionality
- Drag-and-drop reordering
- Goal search or filtering
