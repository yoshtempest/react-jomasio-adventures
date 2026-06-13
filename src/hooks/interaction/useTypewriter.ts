import { useEffect, useRef, useState, useCallback } from "react";

export function useTypewriter(
  text: string,
  speedMs: number,
) {
  const [displayedCount, setDisplayedCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    countRef.current = 0;
    setDisplayedCount(0);
  }, [text]);

  useEffect(() => {
    if (speedMs <= 0 || countRef.current >= text.length) {
      countRef.current = text.length;
      setDisplayedCount(text.length);
      return;
    }

    const id = setInterval(() => {
      countRef.current += 1;
      setDisplayedCount(countRef.current);

      if (countRef.current >= text.length) {
        clearInterval(id);
      }
    }, speedMs);

    return () => clearInterval(id);
  }, [text, speedMs, text.length]);

  const isComplete = displayedCount >= text.length;

  const skip = useCallback(() => {
    if (countRef.current >= text.length) return;
    countRef.current = text.length;
    setDisplayedCount(text.length);
  }, [text.length]);

  return {
    displayedText: text.slice(0, displayedCount),
    isComplete,
    skip,
  };
}
