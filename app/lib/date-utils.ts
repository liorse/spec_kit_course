// Date utility functions using date-fns
import { differenceInDays, parseISO } from 'date-fns';
import type { Goal, UrgencyLevel } from './types';

/**
 * Calculate days remaining until goal deadline
 * @param goal - The goal to calculate days remaining for
 * @returns Number of days remaining, or 'overdue' if past deadline
 */
export function calculateDaysRemaining(goal: Goal): number | 'overdue' {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to midnight for accurate day calculation
  
  const deadline = parseISO(goal.endDate);
  deadline.setHours(0, 0, 0, 0); // Reset to midnight
  
  const days = differenceInDays(deadline, today);
  
  return days < 0 ? 'overdue' : days;
}

/**
 * Get urgency level based on days remaining
 * @param goal - The goal to evaluate
 * @returns Urgency level: 'normal', 'urgent', or 'overdue'
 */
export function getUrgencyLevel(goal: Goal): UrgencyLevel {
  const daysRemaining = calculateDaysRemaining(goal);
  
  if (daysRemaining === 'overdue') return 'overdue';
  if (daysRemaining <= 3) return 'urgent';
  return 'normal';
}

/**
 * Get display text for days remaining
 * @param goal - The goal to get display text for
 * @returns Human-readable text like "2 days left" or "Overdue"
 */
export function getDaysRemainingText(goal: Goal): string {
  const daysRemaining = calculateDaysRemaining(goal);
  
  if (daysRemaining === 'overdue') return 'Overdue';
  if (daysRemaining === 0) return 'Due today';
  if (daysRemaining === 1) return '1 day left';
  return `${daysRemaining} days left`;
}
