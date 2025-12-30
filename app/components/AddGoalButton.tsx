'use client';

// Floating action button to open the add goal modal
import { Button } from '@/components/ui/button';

interface AddGoalButtonProps {
  onClick: () => void;
}

/**
 * Prominent button to open the add goal modal
 * Positioned as a fixed floating action button
 */
export function AddGoalButton({ onClick }: AddGoalButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow md:h-auto md:w-auto md:rounded-lg md:px-6"
      aria-label="Add new goal"
    >
      <span className="text-2xl md:hidden">+</span>
      <span className="hidden md:inline">+ Add Goal</span>
    </Button>
  );
}
