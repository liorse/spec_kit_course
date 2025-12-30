'use client';

// Custom hook for goal state management
import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEY } from '../lib/storage';
import type { Goal } from '../lib/types';

/**
 * Return type for useGoals hook
 */
export interface UseGoalsReturn {
  goals: Goal[];
  activeGoals: Goal[];
  completedGoals: Goal[];
  addGoal: (title: string, endDate: string) => void;
  completeGoal: (id: string) => void;
  uncompleteGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
}

/**
 * Custom hook for managing goals with localStorage persistence
 * Provides CRUD operations and computed values (active/completed goals)
 */
export function useGoals(): UseGoalsReturn {
  const [goals, setGoals] = useLocalStorage<Goal[]>(STORAGE_KEY, []);

  // Computed: Active goals sorted by endDate (soonest first)
  const activeGoals = useMemo(() => 
    goals
      .filter(g => g.status === 'active')
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()),
    [goals]
  );

  // Computed: Completed goals sorted by completedAt (most recent first)
  const completedGoals = useMemo(() =>
    goals
      .filter(g => g.status === 'completed')
      .sort((a, b) => {
        if (!a.completedAt || !b.completedAt) return 0;
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      }),
    [goals]
  );

  // Add a new goal
  const addGoal = (title: string, endDate: string) => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title: title.trim(),
      endDate,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setGoals([...goals, newGoal]);
  };

  // Mark a goal as completed
  const completeGoal = (id: string) => {
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, status: 'completed' as const, completedAt: new Date().toISOString() }
        : goal
    ));
  };

  // Mark a completed goal as active again
  const uncompleteGoal = (id: string) => {
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, status: 'active' as const, completedAt: undefined }
        : goal
    ));
  };

  // Delete a goal permanently
  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  return {
    goals,
    activeGoals,
    completedGoals,
    addGoal,
    completeGoal,
    uncompleteGoal,
    deleteGoal,
  };
}
