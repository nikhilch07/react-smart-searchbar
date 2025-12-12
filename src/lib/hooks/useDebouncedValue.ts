import { useState, useEffect } from 'react';

export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebounced(value);
    }, delay);
    return () => clearTimeout(handle);
  });
  
  return debounced;
};
