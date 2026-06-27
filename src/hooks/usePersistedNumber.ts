import { useState, useEffect } from "react";

export function usePersistedNumber(key: string, defaultValue: number) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? Number(saved) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, String(value));
  }, [value, key]);

  return [value, setValue] as const;
}
