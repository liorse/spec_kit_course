# Feature Specification: Drag and Drop Goal Reordering

**Feature Branch**: `002-drag-drop-reorder`  
**Created**: December 30, 2025  
**Status**: Draft  
**Input**: User description: "let's make it so that users can reorder goals by dragging and dropping them above or below other goals in the list."

## User Scenarios *(mandatory)*

### User Story 1 - Basic Goal Reordering (Priority: P1)

A user with multiple goals wants to change the order of their goals to reflect their current priorities. They click and hold on a goal, drag it to a new position above or below another goal, and release to drop it in place. The goal list immediately updates to show the new order.

**Why this priority**: This is the core functionality that delivers the primary value - allowing users to organize their goals in a priority order that makes sense to them. Without this, the feature cannot exist.

**Independent Verification**: Can be manually verified by creating multiple goals, dragging one goal above or below another, and confirming the order persists after the drag operation completes.

**Acceptance Scenarios**:

1. **Given** a user has 3 or more goals displayed, **When** they drag a goal from position 1 to position 3, **Then** the goal appears in position 3 and other goals shift accordingly
2. **Given** a user has multiple goals, **When** they drag a goal and hover over another goal, **Then** visual feedback indicates where the goal will be placed when dropped
3. **Given** a user starts dragging a goal, **When** they release it in a valid drop zone, **Then** the new order is saved immediately and persists across page refreshes

---

### User Story 2 - Visual Drag Feedback (Priority: P2)

While dragging a goal, the user receives clear visual feedback showing the current drag state and the target drop location. The goal being dragged appears slightly elevated or highlighted, and a visual indicator (like a line or gap) shows where the goal will land when dropped.

**Why this priority**: Visual feedback is critical for usability and user confidence during the drag operation. Without it, users may be confused about what's happening or where their goal will end up.

**Independent Verification**: Can be manually verified by dragging a goal and observing that the dragged element has distinct styling and drop zones are clearly marked during the drag operation.

**Acceptance Scenarios**:

1. **Given** a user starts dragging a goal, **When** the drag begins, **Then** the goal being dragged has distinct visual styling (opacity, shadow, or elevation)
1. **Given** a user is dragging a goal over the list, **When** they hover between two goals, **Then** a horizontal colored line appears showing the drop position
3. **Given** a user is dragging a goal, **When** they move it over an invalid drop area, **Then** visual feedback indicates the drop is not allowed

---

### User Story 3 - Cancel Drag Operation (Priority: P3)

A user who starts dragging a goal but changes their mind can cancel the drag operation without changing the goal order. They can do this by pressing the Escape key or by dragging the goal back to its original position.

**Why this priority**: This provides users with an escape hatch if they start a drag by accident or change their mind. It's important for user control but not critical for the basic functionality.

**Independent Verification**: Can be manually verified by starting a drag operation, pressing Escape or dropping the goal back at its original position, and confirming the order remains unchanged.

**Acceptance Scenarios**:

1. **Given** a user is dragging a goal, **When** they press the Escape key, **Then** the drag operation is cancelled and the goal returns to its original position
2. **Given** a user is dragging a goal, **When** they drop it back at its original position, **Then** no reordering occurs and the list remains unchanged

---

### Edge Cases

- What happens when there is only one goal in the list? (User should see drag affordance but dragging has no effect since there's nowhere to reorder)
- What happens when a user drags a goal completely outside the goal list area? (Goal should return to original position, treating it as a cancelled operation)
- What happens if the user has a very long list of goals and needs to drag a goal from the top to the bottom? (The viewport should auto-scroll when the dragged goal is near the top or bottom edge, allowing seamless reordering across the entire list)
- What happens when a drag operation is in progress and the user navigates away or refreshes the page? (Operation is cancelled, no changes saved)
- What happens on touch devices vs mouse-based devices? (Touch devices require long-press to initiate drag to avoid conflicts with scrolling; mouse devices use click-and-hold. Both should show appropriate visual feedback)
- What happens when a keyboard user is reordering and reaches the end of the list? (Arrow key movement should stop at list boundaries with appropriate feedback)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to initiate a drag operation by clicking and holding (mouse), long-pressing then dragging (touch), or using keyboard navigation
- **FR-002**: System MUST display visual feedback when a goal is being dragged (e.g., the dragged goal appears distinct from other goals)
- **FR-003**: System MUST show a horizontal colored line between goals indicating where the goal will be placed when dropped
- **FR-004**: System MUST allow users to drop a goal above or below any other goal in the list
- **FR-005**: System MUST update the goal order immediately when a goal is dropped in a new position
- **FR-006**: System MUST persist the new goal order so it remains after page refreshes or app restarts
- **FR-007**: System MUST support cancelling a drag operation via the Escape key or by dropping the goal at its original position
- **FR-008**: System MUST handle both mouse-based and touch-based drag interactions
- **FR-009**: System MUST support keyboard-only navigation for reordering (Tab to focus goals, Space/Enter to grab, Arrow keys to move position, Space/Enter to drop)
- **FR-010**: System MUST prevent invalid drop operations (e.g., dropping outside the goal list area)
- **FR-011**: System MUST maintain goal data integrity during reordering (all goal properties remain unchanged except position)
- **FR-012**: System MUST provide clear affordances that goals are draggable (e.g., cursor changes, visual cues)
- **FR-013**: System MUST reorder other goals appropriately when a goal is inserted at a new position
- **FR-014**: System MUST auto-scroll the viewport when a goal is dragged near the top or bottom edge, enabling reordering across long lists

### Key Entities

- **Goal**: Represents a user's goal item with properties including a unique identifier, title, description, status, and an order/position value that determines its placement in the list. When reordered, only the position values change while all other properties remain intact.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully reorder a goal within 5 seconds from starting the drag to completing the drop
- **SC-002**: The reordered goal list persists correctly across page refreshes with 100% accuracy
- **SC-003**: Visual feedback appears within 100 milliseconds of starting a drag operation
- **SC-004**: Users can complete a drag-and-drop reorder operation on first attempt with 90% success rate
- **SC-005**: The feature works smoothly on both desktop (mouse) and mobile (touch) devices without degradation
- **SC-006**: Drag operations can be cancelled successfully 100% of the time using Escape key or drop-at-original-position
- **SC-007**: The feature maintains smooth performance with up to 100 goals in the list without lag or stuttering during drag operations

## Clarifications

### Session 2025-12-30

- Q: When a user drags a goal between two other goals, what should the drop position indicator look like? → A: Show a horizontal colored line between goals where the item will be inserted
- Q: When a user has many goals and needs to drag one from the top to the bottom (or vice versa), how should scrolling work during the drag? → A: Auto-scroll when dragging near the top or bottom edge of the viewport
- Q: Should the drag-and-drop feature support keyboard-only navigation for users who cannot use a mouse or touch? → A: Add keyboard navigation (Tab to focus, Space/Enter to grab, Arrow keys to move, Space/Enter to drop)
- Q: For touch devices (smartphones, tablets), should the drag operation use a long-press to initiate or immediate drag? → A: Long-press then drag
- Q: What is the maximum number of goals the drag-and-drop feature should handle without performance degradation? → A: 100 goals

## Assumptions

- Users are familiar with standard drag-and-drop interactions from other applications
- The goal list is displayed in a vertical layout (goals stacked top to bottom)
- Goals are stored with a position/order property that can be updated
- The application already has a mechanism for persisting goal data (localStorage, database, etc.)
- Modern browsers with support for drag-and-drop events or touch events are being used
- Goals remain in the same category/status during reordering (no cross-category dragging)
