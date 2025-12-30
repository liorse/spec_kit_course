'use client';

// Individual goal card component with countdown timer and action buttons
import { useState } from 'react';
import { getDaysRemainingText, calculateDaysRemaining, getUrgencyLevel } from '../lib/date-utils';
import { Button } from '@/components/ui/button';
import type { Goal } from '../lib/types';

interface GoalCardProps {
  goal: Goal;
  onComplete?: (id: string) => void;
  onUncomplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * Display individual goal with title, days remaining, checkbox, and action buttons
 * Styling varies based on urgency level
 */
export function GoalCard({ goal, onComplete, onUncomplete, onDelete }: GoalCardProps) {
  const [showActions, setShowActions] = useState(false);
  const showCountdown = goal.status === 'active';
  const isOverdue = goal.status === 'active' && calculateDaysRemaining(goal) === 'overdue';
  const urgencyLevel = goal.status === 'active' ? getUrgencyLevel(goal) : 'normal';

  const handleCheckboxClick = () => {
    setShowActions(!showActions);
  };

  // Get urgency styling classes
  const getUrgencyClasses = () => {
    if (urgencyLevel === 'overdue') {
      return 'border-[oklch(0.85_0.12_10)] bg-[oklch(0.95_0.08_10)]';
    }
    if (urgencyLevel === 'urgent') {
      return 'border-[oklch(0.90_0.08_90)] bg-[oklch(0.96_0.05_90)]';
    }
    return 'border-border bg-card';
  };

  return (
    <div className={`p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 ${getUrgencyClasses()}`}>
      <div className="flex items-start gap-3">
        {/* Checkbox for selecting goal */}
        <input
          type="checkbox"
          checked={showActions}
          onChange={handleCheckboxClick}
          className="mt-1 w-5 h-5 rounded border-border cursor-pointer"
          aria-label={`Select ${goal.title}`}
        />
        
        <div className="flex-1 min-w-0">
          {/* Goal title */}
          <h3 className="font-medium text-foreground mb-1 break-words">
            {goal.title}
          </h3>
          
          {/* Days remaining (only for active goals) */}
          {showCountdown && (
            <p className="text-sm text-muted-foreground">
              {getDaysRemainingText(goal)}
            </p>
          )}

          {/* Action buttons (shown when checkbox is checked) */}
          {showActions && (
            <div className="mt-3 flex gap-2 transition-opacity duration-300">
              {goal.status === 'active' ? (
                <>
                  {/* Complete button (hidden for overdue goals) */}
                  {!isOverdue && onComplete && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        onComplete(goal.id);
                        setShowActions(false);
                      }}
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    >
                      Complete
                    </Button>
                  )}
                  {/* Delete button */}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(goal.id)}
                    >
                      Delete
                    </Button>
                  )}
                </>
              ) : (
                <>
                  {/* Uncomplete button */}
                  {onUncomplete && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        onUncomplete(goal.id);
                        setShowActions(false);
                      }}
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Uncomplete
                    </Button>
                  )}
                  {/* Delete button */}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(goal.id)}
                    >
                      Delete
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
