import { useEffect, useRef, useState, useCallback } from "react";

export function useTypewriter(text: string, speedMs: number) {
  const safeText = text ?? "";
  const [displayedCount, setDisplayedCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    countRef.current = 0;
    setDisplayedCount(0);
  }, [safeText]);

  useEffect(() => {
    if (speedMs <= 0 || countRef.current >= safeText.length) {
      countRef.current = safeText.length;
      setDisplayedCount(safeText.length);
      return;
    }

    const id = setInterval(() => {
      countRef.current += 1;
      setDisplayedCount(countRef.current);

      if (countRef.current >= safeText.length) {
        clearInterval(id);
      }
    }, speedMs);

    return () => clearInterval(id);
  }, [safeText, speedMs, safeText.length]);

  const isComplete = displayedCount >= safeText.length;

  const skip = useCallback(() => {
    if (countRef.current >= safeText.length) return;
    countRef.current = safeText.length;
    setDisplayedCount(safeText.length);
  }, [safeText.length]);

  return {
    displayedText: safeText.slice(0, displayedCount),
    isComplete,
    skip,
  };
}
