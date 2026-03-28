import { useRef } from "react";

export function useHoldAction(action: () => void, delay = 300) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function start() {
    action(); // executa 1 vez imediatamente

    intervalRef.current = setInterval(() => {
      action();
    }, delay);
  }

  function stop() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
}