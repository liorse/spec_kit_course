# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., TypeScript 5.x with Next.js 16.1.1 and React 19.2.3 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., Next.js, React, Tailwind CSS or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, files, browser storage or N/A]  
**Target Platform**: [e.g., Web browsers (Chrome, Firefox, Safari, Edge) or NEEDS CLARIFICATION]
**Project Type**: [single/web/mobile - determines source structure]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

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
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Next.js Application (DEFAULT for this project)
app/
├── (routes)/          # App router pages
├── components/        # Reusable React components
├── api/              # API routes (if needed)
└── globals.css       # Global Tailwind styles

public/               # Static assets
├── images/
└── icons/

# [REMOVE IF UNUSED] Option 2: Next.js with separate API backend
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/

app/
├── (routes)/
├── components/
└── services/         # Frontend API clients

# [REMOVE IF UNUSED] Option 3: Monorepo structure
apps/
├── web/             # Main Next.js app
└── admin/           # Admin Next.js app

packages/
├── ui/              # Shared components
└── utils/           # Shared utilities
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
