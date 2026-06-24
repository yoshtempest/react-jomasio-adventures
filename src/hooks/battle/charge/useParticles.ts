import { useState, useRef, useCallback, useEffect } from "react";
import { CHARGE_TIME } from "@/utils/types/battle/charge";
import type { ChargeParticle } from "@/utils/types/battle/charge";

export function useChargeParticles() {
  const [isCharging, setIsCharging] = useState(false);
  const [chargeReady, setChargeReady] = useState(false);
  const [particles, setParticles] = useState<ChargeParticle[]>([]);

  const chargeReadyRef = useRef(false);
  const particleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chargeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const particleIdRef = useRef(0);

  const cleanup = useCallback(() => {
    if (chargeTimerRef.current) {
      clearTimeout(chargeTimerRef.current);
      chargeTimerRef.current = null;
    }
    if (particleIntervalRef.current) {
      clearInterval(particleIntervalRef.current);
      particleIntervalRef.current = null;
    }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  function createParticle(): ChargeParticle {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
    const radius = 10 + Math.random() * 35;
    particleIdRef.current++;
    return {
      id: particleIdRef.current,
      size: 2 + Math.random() * 3,
      opacity: 0.6 + Math.random() * 0.4,
      life: 0,
      maxLife: 400 + Math.random() * 300,
      offsetX: Math.cos(angle) * radius * 0.5,
      offsetY: Math.sin(angle) * radius - 10,
    };
  }

  function updateParticles() {
    const ready = chargeReadyRef.current;
    setParticles((prev) => {
      const alive = prev
        .map((p) => ({ ...p, life: p.life + 100 }))
        .filter((p) => p.life < p.maxLife);

      const maxParticles = ready ? 28 : 15;
      while (alive.length < maxParticles) {
        alive.push(createParticle());
        if (ready) alive.push(createParticle());
      }

      return alive;
    });
  }

  function start() {
    setIsCharging(true);
    setChargeReady(false);
    chargeReadyRef.current = false;
    setParticles([]);
    particleIdRef.current = 0;

    particleIntervalRef.current = setInterval(updateParticles, 100);

    chargeTimerRef.current = setTimeout(() => {
      setChargeReady(true);
      chargeReadyRef.current = true;
    }, CHARGE_TIME);
  }

  function stop() {
    cleanup();
    setIsCharging(false);
    setChargeReady(false);
    chargeReadyRef.current = false;
    setParticles([]);
  }

  return { isCharging, chargeReady, particles, start, stop };
}
