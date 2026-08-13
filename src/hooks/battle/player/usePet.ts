import { useEffect, useRef, useState } from "react";

type Props = {
  enabled: boolean;
  playerX: number;
  playerY: number;
  npcX: number;
  isPaused: boolean;
  spriteNpcType?: string;
};

export type PetState = {
  x: number;
  y: number;
  direction: "left" | "right";
  state: "idle" | "walk" | "attack";
  npcType: string;
} | null;

const OFFSET_X = 60;

export function usePetBattle({
  enabled,
  playerX,
  playerY,
  npcX,
  isPaused,
  spriteNpcType = "goat",
}: Props) {
  const [pet, setPet] = useState<PetState>(null);

  const playerXRef = useRef(playerX);
  playerXRef.current = playerX;
  const playerYRef = useRef(playerY);
  playerYRef.current = playerY;
  const npcXRef = useRef(npcX);
  npcXRef.current = npcX;
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  useEffect(() => {
    if (!enabled) {
      setPet(null);
      return;
    }

    setPet((prev) => {
      if (prev) return prev;
      return {
        x: playerX - OFFSET_X,
        y: playerY,
        direction: "right",
        state: "idle",
        npcType: spriteNpcType,
      };
    });
  }, [enabled, playerX, playerY, spriteNpcType]);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      if (isPausedRef.current) return;

      const targetX = playerXRef.current - OFFSET_X;
      const direction: "left" | "right" =
        npcXRef.current - playerXRef.current > 0 ? "right" : "left";

      setPet((prev) => {
        if (!prev) return prev;
        const nearTarget = Math.abs(prev.x - targetX) < 1;
        const sameY = prev.y === playerYRef.current;
        if (nearTarget && sameY && prev.direction === direction) return prev;
        const nextX = nearTarget ? targetX : prev.x + (targetX - prev.x) * 0.25;
        return {
          ...prev,
          x: nextX,
          y: playerYRef.current,
          direction,
          state: "idle",
        };
      });
    }, 20);

    return () => clearInterval(interval);
  }, [enabled]);

  function resetPet() {
    if (!enabled) return;
    setPet({
      x: playerX - OFFSET_X,
      y: playerY,
      direction: "right",
      state: "idle",
      npcType: spriteNpcType,
    });
  }

  return { pet, resetPet };
}
