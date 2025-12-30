'use client';

// Individual goal card component with countdown timer and action buttons
import { useState } from 'react';
import { getDaysRemainingText, calculateDaysRemaining, getUrgencyLevel } from '../lib/date-utils';
import { Button } from '@/components/ui/button';
import type { Goal } from '../lib/types';
import { Check, Trash2, RotateCcw, CheckCircle2 } from 'lucide-react';

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

  const handleCardClick = () => {
    setShowActions(!showActions);
  };

  // Get urgency styling classes
  const getUrgencyStyles = () => {
    if (urgencyLevel === 'overdue') {
      return 'border-l-4 border-l-[var(--danger)] bg-card';
    }
    if (urgencyLevel === 'urgent') {
      return 'border-l-4 border-l-[var(--warning)] bg-card';
    }
    return 'border-l-4 border-l-transparent bg-card';
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group relative p-4 rounded-r-xl rounded-l-sm border border-l-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${getUrgencyStyles()}`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            goal.status === 'completed' 
              ? 'bg-primary border-primary' 
              : 'border-muted-foreground/30 group-hover:border-primary/50'
          }`}
        >
          {goal.status === 'completed' && <Check className="w-3 h-3 text-primary-foreground" />}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Goal title */}
          <h3 className={`font-medium text-base mb-1 break-words transition-colors ${
            goal.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'
          }`}>
            {goal.title}
          </h3>
          
          {/* Days remaining (only for active goals) */}
          {showCountdown && (
            <p className={`text-xs font-medium ${
              urgencyLevel === 'overdue' ? 'text-[var(--danger)]' : 
              urgencyLevel === 'urgent' ? 'text-[var(--warning)]' : 
              'text-muted-foreground'
            }`}>
              {getDaysRemainingText(goal)}
            </p>
          )}

          {/* Action buttons (shown when clicked) */}
          <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
            showActions ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0 mt-0'
          }`}>
            <div className="min-h-0 flex gap-2">
              {goal.status === 'active' ? (
                <>
                  {/* Complete button (hidden for overdue goals) */}
                  {!isOverdue && onComplete && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onComplete(goal.id);
                        setShowActions(false);
                      }}
                      className="h-8 text-xs border-primary/20 hover:bg-primary/5 hover:text-primary"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1.5" />
                      Complete
                    </Button>
                  )}
                  {/* Delete button */}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(goal.id);
                      }}
                      className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3 h-3 mr-1.5" />
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
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUncomplete(goal.id);
                        setShowActions(false);
                      }}
                      className="h-8 text-xs border-muted-foreground/20 hover:bg-muted hover:text-foreground"
                    >
                      <RotateCcw className="w-3 h-3 mr-1.5" />
                      Restore
                    </Button>
                  )}
                  {/* Delete button */}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(goal.id);
                      }}
                      className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3 h-3 mr-1.5" />
                      Delete
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
