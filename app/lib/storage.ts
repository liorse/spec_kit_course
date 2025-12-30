// localStorage utility functions for goal persistence
import type { Goal } from './types';

/**
 * Storage key for goals in localStorage
 */
export const STORAGE_KEY = 'doit-goals';

/**
 * Save goals array to localStorage
 * @param goals - Array of goals to save
 */
export function saveGoals(goals: Goal[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    // Handle quota exceeded or other errors
    console.error('Failed to save goals to localStorage:', error);
    throw new Error('Storage quota exceeded. Please delete some goals to free up space.');
  }
}

/**
 * Load goals array from localStorage
 * @returns Array of goals, empty array if no data found
 */
export function loadGoals(): Goal[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load goals from localStorage:', error);
    return [];
  }
}
