# DoIt - Goal Tracking App

A beautiful, intuitive goal tracking web application that helps you stay motivated and organized with countdown timers and visual urgency indicators.

## Features

- **📋 Two-Column Layout**: View active goals and completed goals side by side
- **⏰ Countdown Timers**: See exactly how many days remain for each goal
- **🎨 Pastel Theme**: Pleasant, calming color scheme that motivates
- **⚠️ Urgency Highlighting**: Visual indicators for goals that are due soon or overdue
- **✅ Goal Management**: Add, complete, uncomplete, and delete goals with ease
- **💾 Local Storage**: Your goals persist across browser sessions
- **📱 Responsive Design**: Works perfectly on mobile, tablet, and desktop

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd spec_kit_course

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Usage

### Adding a Goal
1. Click the **+ Add Goal** button (floating action button on mobile, button on desktop)
2. Enter a title for your goal
3. Select an end date (deadline)
4. Click **Add Goal** to save

### Completing a Goal
1. Click the checkbox on an active goal
2. Click the **Complete** button
3. The goal moves to the "Completed Goals" column

### Uncompleting a Goal
1. Click the checkbox on a completed goal
2. Click the **Uncomplete** button
3. The goal returns to the "Active Goals" column with its original deadline

### Deleting a Goal
1. Click the checkbox on any goal
2. Click the **Delete** button
3. Confirm deletion (goal is permanently removed)

### Understanding Urgency Highlighting
- **Red/Pink Background**: Goal is overdue (past deadline)
- **Yellow Background**: Goal is urgent (3 days or less remaining)
- **Normal Background**: Goal has 4+ days remaining

## Manual Verification Scenarios

See [quickstart.md](specs/001-doit-app/quickstart.md) for detailed manual testing scenarios including:
- Empty state verification
- Adding goals with various deadlines
- Testing urgency highlighting
- Completing/uncompleting goals
- Responsive design testing
- Accessibility verification

## Technology Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4.x with custom pastel theme
- **Components**: shadcn/ui (accessible, customizable components)
- **Date Handling**: date-fns (lightweight, tree-shakeable)
- **State Management**: React hooks (useState, useEffect, useMemo)
- **Storage**: Browser localStorage API

## Project Structure

```
app/
├── components/          # React components
│   ├── AddGoalButton.tsx
│   ├── AddGoalModal.tsx
│   ├── EmptyState.tsx
│   ├── GoalCard.tsx
│   ├── GoalColumn.tsx
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
│   ├── useGoals.tsx
│   └── useLocalStorage.tsx
├── lib/                # Utility functions
│   ├── date-utils.ts
│   ├── storage.ts
│   ├── types.ts
│   └── utils.ts
├── globals.css         # Tailwind + pastel theme
├── layout.tsx          # Root layout
└── page.tsx            # Main page
```

## Development

### Running the Dev Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## Design Philosophy

This application follows a clean, user-friendly design philosophy:
- **Simple UX**: No complex navigation, all features are immediately visible
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Pastel Theme**: Calming colors that reduce stress and improve focus
- **Accessibility**: Keyboard navigation, proper ARIA labels, color contrast
- **Minimal Dependencies**: Only essential packages to keep bundle size small

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This project was built using the SpecKit workflow:
1. Specification ([spec.md](specs/001-doit-app/spec.md))
2. Implementation Plan ([plan.md](specs/001-doit-app/plan.md))
3. Data Model ([data-model.md](specs/001-doit-app/data-model.md))
4. Task Breakdown ([tasks.md](specs/001-doit-app/tasks.md))

## License

MIT

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Date utilities from [date-fns](https://date-fns.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)

