'use client';

// Generic localStorage hook with error handling
import { useState, useEffect } from 'react';

/**
 * Custom hook for managing state synchronized with localStorage
 * @param key - The localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [value, setValue] tuple similar to useState
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Always start with initialValue to match server render
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // After mount, load from localStorage (client-side only)
  useEffect(() => {
    setIsHydrated(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
    }
  }, [key]);

  // Save to localStorage whenever value changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
      }
    }
  }, [key, storedValue, isHydrated]);

  // Update function
  const setValue = (value: T) => {
    setStoredValue(value);
  };

  return [storedValue, setValue];
}
