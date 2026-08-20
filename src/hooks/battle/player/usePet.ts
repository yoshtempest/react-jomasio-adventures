import { useCallback, useEffect, useRef, useState } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";

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

export type PetJumpAttack = {
  npcX: number;
  npcY: number;
  callback: (damage: number) => void;
};

const OFFSET_X = 60;
const JUMP_DURATION = 400;
const ATTACK_DURATION = 350;
const RETURN_SPEED = 0.06;

export function usePetBattle({
  enabled,
  playerX,
  playerY,
  npcX,
  isPaused,
  spriteNpcType = "goat",
}: Props) {
  const [pet, setPet] = useState<PetState>(null);

  const playerXRef = useLatestRef(playerX);
  const playerYRef = useLatestRef(playerY);
  const npcXRef = useLatestRef(npcX);
  const isPausedRef = useLatestRef(isPaused);

  const jumpAttackRef = useRef<PetJumpAttack | null>(null);
  const jumpPhaseRef = useRef<"idle" | "jumping" | "attacking" | "returning">(
    "idle",
  );
  const jumpStartRef = useRef(0);
  const jumpFromRef = useRef({ x: 0, y: 0 });
  const jumpToRef = useRef({ x: 0, y: 0 });
  const jumpCallbackRef = useRef<((damage: number) => void) | null>(null);

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

      const jp = jumpPhaseRef.current;
      if (jp === "jumping" || jp === "attacking" || jp === "returning") {
        setPet((prev) => {
          if (!prev) return prev;
          const now = Date.now();

          if (jp === "jumping") {
            const elapsed = now - jumpStartRef.current;
            const t = Math.min(elapsed / JUMP_DURATION, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            const x =
              jumpFromRef.current.x +
              (jumpToRef.current.x - jumpFromRef.current.x) * eased;
            const arcHeight = -120 * Math.sin(t * Math.PI);
            const baseY =
              jumpFromRef.current.y +
              (jumpToRef.current.y - jumpFromRef.current.y) * eased;
            const dir: "left" | "right" =
              jumpToRef.current.x > prev.x ? "right" : "left";
            if (t >= 1) {
              jumpPhaseRef.current = "attacking";
              jumpStartRef.current = now;
              jumpCallbackRef.current?.(0);
              jumpCallbackRef.current = null;
              return {
                ...prev,
                x: jumpToRef.current.x,
                y: jumpToRef.current.y,
                direction: dir,
                state: "attack",
              };
            }
            return {
              ...prev,
              x,
              y: baseY + arcHeight,
              direction: dir,
              state: "attack",
            };
          }

          if (jp === "attacking") {
            const elapsed = now - jumpStartRef.current;
            if (elapsed >= ATTACK_DURATION) {
              jumpPhaseRef.current = "returning";
              return { ...prev, state: "walk" };
            }
            return prev;
          }

          if (jp === "returning") {
            const targetX = playerXRef.current - OFFSET_X;
            const targetY = playerYRef.current;
            const dx = targetX - prev.x;
            const dy = targetY - prev.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 2) {
              jumpPhaseRef.current = "idle";
              jumpAttackRef.current = null;
              return {
                ...prev,
                x: targetX,
                y: targetY,
                direction:
                  npcXRef.current - playerXRef.current > 0 ? "right" : "left",
                state: "idle",
              };
            }
            return {
              ...prev,
              x: prev.x + dx * RETURN_SPEED,
              y: prev.y + dy * RETURN_SPEED,
              direction: dx > 0 ? "right" : "left",
              state: "walk",
            };
          }

          return prev;
        });
        return;
      }

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
  }, [enabled, isPausedRef, npcXRef, playerXRef, playerYRef]);

  const triggerJumpAttack = useCallback(
    (npcY: number, callback: (damage: number) => void) => {
      if (jumpPhaseRef.current !== "idle") return;
      setPet((prev) => {
        if (!prev) return prev;
        jumpPhaseRef.current = "jumping";
        jumpStartRef.current = Date.now();
        jumpFromRef.current = { x: prev.x, y: prev.y };
        jumpToRef.current = { x: npcXRef.current, y: npcY };
        jumpCallbackRef.current = callback;
        return prev;
      });
    },
    [npcXRef],
  );

  function resetPet() {
    if (!enabled) return;
    jumpPhaseRef.current = "idle";
    jumpAttackRef.current = null;
    setPet({
      x: playerX - OFFSET_X,
      y: playerY,
      direction: "right",
      state: "idle",
      npcType: spriteNpcType,
    });
  }

  return { pet, resetPet, triggerJumpAttack };
}
