// TypeScript types and interfaces for DoIt Goal Tracking App

/**
 * Status of a goal - either active (not completed yet) or completed
 */
export type GoalStatus = 'active' | 'completed';

/**
 * Represents a user's goal with a deadline
 */
export interface Goal {
  id: string;              // UUID v4 for uniqueness
  title: string;           // User-defined goal description
  endDate: string;         // ISO 8601 date string (YYYY-MM-DD)
  status: GoalStatus;      // Current state of goal
  createdAt: string;       // ISO 8601 timestamp
  completedAt?: string;    // ISO 8601 timestamp (only for completed goals)
}

/**
 * Urgency level based on days remaining
 */
export type UrgencyLevel = 'normal' | 'urgent' | 'overdue';
