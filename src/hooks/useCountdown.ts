import { useState, useCallback, useEffect } from "react";

export function useCountdown(cooldownMs: number, lastEventTime: number) {
  const calcTimeLeft = useCallback(
    () => cooldownMs - (Date.now() - lastEventTime),
    [cooldownMs, lastEventTime],
  );

  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);

  useEffect(() => {
    setTimeLeft(calcTimeLeft());
    const interval = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [calcTimeLeft]);

  return Math.max(0, timeLeft);
}
