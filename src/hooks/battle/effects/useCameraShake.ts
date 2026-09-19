import { useCallback, useEffect, useRef, useState } from "react";
import type { DamageNumber } from "@/hooks/battle/damage/useNumbers";

const MAX_INTENSITY = 50;
const MAX_DAMAGE_FOR_INTENSITY = 200;
const INTENSITY_PER_DAMAGE = 0.25;
const SHAKE_DECAY = 0.88;
const MIN_INTENSITY = 0.1;

export function useCameraShake(damageNumbers: DamageNumber[]) {
  const intensityRef = useRef(0);
  const runningRef = useRef(false);
  const rafRef = useRef(0);
  const seenIdsRef = useRef<Set<number>>(new Set());
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const startLoop = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;

    const step = () => {
      const intensity = intensityRef.current;
      if (intensity <= MIN_INTENSITY) {
        intensityRef.current = 0;
        runningRef.current = false;
        setOffset({ x: 0, y: 0 });
        return;
      }
      intensityRef.current = intensity * SHAKE_DECAY;
      setOffset({
        x: (Math.random() * 2 - 1) * intensity,
        y: (Math.random() * 2 - 1) * intensity,
      });
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const seen = seenIdsRef.current;
    let added = 0;
    for (const n of damageNumbers) {
      if (seen.has(n.id)) continue;
      seen.add(n.id);
      if (n.value > 0) added += n.value;
    }
    if (added <= 0) return;

    intensityRef.current = Math.min(
      MAX_INTENSITY,
      intensityRef.current +
        Math.min(added, MAX_DAMAGE_FOR_INTENSITY) * INTENSITY_PER_DAMAGE,
    );
    startLoop();
  }, [damageNumbers, startLoop]);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return offset;
}
