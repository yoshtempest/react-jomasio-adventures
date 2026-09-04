import { useState, useCallback, useRef } from "react";

const KOKUSEN_FRAMES = ["one", "two", "three", "four", "five"] as const;
const FRAME_DURATION = 45;

export function useKokusenAnimation() {
  const [kokusen, setKokusen] = useState<{
    active: boolean;
    frame: number;
  }>({ active: false, frame: 0 });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const trigger = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setKokusen({ active: true, frame: 0 });

    let currentFrame = 0;

    function nextFrame() {
      currentFrame++;
      if (currentFrame >= KOKUSEN_FRAMES.length) {
        setKokusen({ active: false, frame: 0 });
        timerRef.current = null;
        return;
      }
      setKokusen({ active: true, frame: currentFrame });
      timerRef.current = setTimeout(nextFrame, FRAME_DURATION);
    }

    timerRef.current = setTimeout(nextFrame, FRAME_DURATION);
  }, []);

  const kokusenFrame = kokusen.active
    ? (KOKUSEN_FRAMES[kokusen.frame] ?? null)
    : null;

  return {
    kokusenActive: kokusen.active,
    kokusenFrame,
    triggerKokusen: trigger,
  };
}
