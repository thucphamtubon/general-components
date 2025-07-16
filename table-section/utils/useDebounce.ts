import { useState, useEffect } from 'react';

/**
 * useDebounce hook
 * Delays updating of a value until after a given delay has elapsed.
 * This is helpful for rate-limiting user input (e.g. table search field).
 *
 * @param value   The original value to debounce.
 * @param delay   Delay in milliseconds. Defaults to 300 ms.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
