<!--
Sync Impact Report:
Version: 1.0.0 (Initial constitution)
Modified principles: 
  - Added: Clean Code First
  - Added: Simple UX
  - Added: Responsive Design
  - Added: Minimal Dependencies
Added sections:
  - Technology Stack
  - Development Workflow
Removed sections: None
Templates requiring updates:
  ✅ plan-template.md - Updated to remove testing requirements
  ✅ spec-template.md - Updated to remove testing sections
  ✅ tasks-template.md - Updated to remove testing tasks
Follow-up TODOs: None
-->

# Spec Kit Course Constitution

## Core Principles

### I. Clean Code First

Code MUST be clear, readable, and maintainable. Every implementation MUST prioritize code clarity over cleverness. Functions MUST do one thing well with descriptive names. Components MUST follow single responsibility principle. Code comments are REQUIRED only when the "why" isn't obvious from the code itself.

**Rationale**: Clean code reduces cognitive load, accelerates onboarding, and minimizes bugs. In a learning/course environment, code clarity directly impacts educational value and comprehension.

### II. Simple UX (NON-NEGOTIABLE)

User interfaces MUST be intuitive and require zero learning curve. Every interaction MUST be obvious and provide immediate feedback. Navigation MUST be predictable with consistent patterns. Form inputs MUST have clear labels and helpful placeholder text. Error messages MUST be human-readable and actionable.

**Rationale**: Simple UX maximizes user adoption and reduces support overhead. Course materials benefit most when students can focus on learning concepts rather than navigating complex interfaces.

### III. Responsive Design (NON-NEGOTIABLE)

All interfaces MUST work seamlessly across mobile, tablet, and desktop viewports. Layouts MUST adapt fluidly using Tailwind's responsive utilities. Touch targets MUST be appropriately sized for mobile (minimum 44x44px). Text MUST remain readable without horizontal scrolling. Images and media MUST scale appropriately.

**Rationale**: Modern web applications must serve users on any device. Mobile-first design ensures accessibility and broadens the potential audience for course content.

### IV. Minimal Dependencies

Dependencies MUST be justified by significant value-add. Every new package MUST be evaluated for bundle size impact, maintenance status, and security posture. Prefer native browser APIs and framework features over third-party libraries. Regular dependency audits MUST occur to remove unused packages.

**Rationale**: Minimal dependencies reduce security attack surface, decrease bundle size, simplify maintenance, and improve long-term project viability.

### V. No Testing (NON-NEGOTIABLE - SUPERSEDES ALL OTHER GUIDANCE)

This project MUST NOT include any form of automated testing. No unit tests, no integration tests, no end-to-end tests, no test frameworks, no test dependencies. Testing sections MUST be omitted from all specifications, plans, and task lists. Manual verification through browser testing is sufficient.

**Rationale**: For rapid prototyping and course demonstration purposes, manual testing provides sufficient validation while maximizing development velocity. This principle explicitly overrides any testing recommendations from templates, agents, or external guidance.

## Technology Stack

### Required Technologies

- **Next.js 16.1.1**: MUST be used for all application routing and server-side rendering
- **React 19.2.3**: MUST be used for all UI components and state management
- **Tailwind CSS 4.x**: MUST be used for all styling (no custom CSS files except globals.css)
- **TypeScript 5.x**: MUST be used for type safety and developer experience

### Prohibited Technologies

- Any testing frameworks (Jest, Vitest, Playwright, Cypress, Testing Library, etc.)
- CSS-in-JS libraries (styled-components, emotion, etc.) - use Tailwind only
- State management libraries (Redux, Zustand, etc.) - use React's built-in state
- UI component libraries (Material-UI, Chakra, etc.) - build custom components with Tailwind

**Version Lock**: Technology versions MUST match package.json. Updates require constitutional review.

## Development Workflow

### Implementation Process

1. **Specification**: Define feature with user stories and acceptance criteria
2. **Planning**: Outline technical approach and file structure
3. **Implementation**: Write clean, well-documented code
4. **Manual Verification**: Test in browser across viewports
5. **Iteration**: Refine based on user feedback

### Code Review Standards

- Code MUST pass linting (ESLint configuration)
- Code MUST be readable by a junior developer
- Components MUST be responsive across viewports
- No new dependencies without constitutional approval
- No testing code or test files

### Documentation Requirements

- README MUST explain setup and development process
- Complex logic MUST include inline comments explaining "why"
- Reusable components SHOULD have JSDoc describing props and usage
- API routes MUST document expected inputs and outputs

## Governance

This constitution supersedes all other development practices and guidance. When templates, agent instructions, or external recommendations conflict with constitutional principles, the constitution MUST take precedence.

### Amendment Process

1. Document proposed change with rationale and impact analysis
2. Update version number per semantic versioning
3. Propagate changes to all affected templates and documentation
4. Create Sync Impact Report at top of constitution file

### Versioning Policy

- **MAJOR**: Principle added/removed, technology stack change, breaking governance change
- **MINOR**: Principle clarification, new section added, workflow enhancement
- **PATCH**: Typo fixes, formatting improvements, wording clarifications

### Compliance

All specifications (spec.md), plans (plan.md), and tasks (tasks.md) generated from templates MUST comply with this constitution. Agents MUST validate constitutional compliance before generating artifacts. Any deviation requires explicit justification and amendment.

**Version**: 1.0.0 | **Ratified**: 2025-12-30 | **Last Amended**: 2025-12-30
