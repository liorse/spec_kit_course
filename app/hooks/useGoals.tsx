'use client';

// Custom hook for goal state management
import { useMemo, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEY } from '../lib/storage';
import type { Goal, GoalStatus } from '../lib/types';

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
  reorderGoals: (goalId: string, oldIndex: number, newIndex: number, status: GoalStatus) => void;
}

/**
 * Custom hook for managing goals with localStorage persistence
 * Provides CRUD operations and computed values (active/completed goals)
 */
export function useGoals(): UseGoalsReturn {
  const [goals, setGoals] = useLocalStorage<Goal[]>(STORAGE_KEY, []);

  // Migration: Add order property to existing goals (runs once)
  useEffect(() => {
    const migrated = localStorage.getItem('doit-migration-v2');
    if (!migrated && goals.length > 0) {
      const needsMigration = goals.some(g => g.order === undefined);
      if (needsMigration) {
        const activeGoals = goals
          .filter(g => g.status === 'active')
          .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
          .map((g, idx) => ({ ...g, order: idx }));
        
        const completedGoals = goals
          .filter(g => g.status === 'completed')
          .sort((a, b) => {
            if (!a.completedAt || !b.completedAt) return 0;
            return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
          })
          .map((g, idx) => ({ ...g, order: idx }));
        
        setGoals([...activeGoals, ...completedGoals]);
        localStorage.setItem('doit-migration-v2', 'true');
      }
    }
  }, [goals, setGoals]);

  // Computed: Active goals sorted by order (ascending)
  const activeGoals = useMemo(() => 
    goals
      .filter(g => g.status === 'active')
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
    [goals]
  );

  // Computed: Completed goals sorted by order (ascending)
  const completedGoals = useMemo(() =>
    goals
      .filter(g => g.status === 'completed')
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
    [goals]
  );

  // Add a new goal
  const addGoal = (title: string, endDate: string) => {
    const activeGoals = goals.filter(g => g.status === 'active');
    const maxOrder = activeGoals.length > 0 
      ? Math.max(...activeGoals.map(g => g.order ?? 0))
      : -1;
    
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title: title.trim(),
      endDate,
      status: 'active',
      createdAt: new Date().toISOString(),
      order: maxOrder + 1,
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

  // Reorder goals within a status group
  const reorderGoals = (goalId: string, oldIndex: number, newIndex: number, status: GoalStatus) => {
    const statusGoals = goals.filter(g => g.status === status).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    const otherGoals = goals.filter(g => g.status !== status);
    
    const [movedGoal] = statusGoals.splice(oldIndex, 1);
    statusGoals.splice(newIndex, 0, movedGoal);
    
    const reorderedStatusGoals = statusGoals.map((g, idx) => ({ ...g, order: idx }));
    setGoals([...reorderedStatusGoals, ...otherGoals]);
  };

  return {
    goals,
    activeGoals,
    completedGoals,
    addGoal,
    completeGoal,
    uncompleteGoal,
    deleteGoal,
    reorderGoals,
  };
}
