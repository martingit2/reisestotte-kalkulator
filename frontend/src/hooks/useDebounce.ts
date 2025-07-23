// Fil: frontend/src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

// En custom hook som tar en verdi og en forsinkelse, og returnerer den "debounced" verdien
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}