import { useEffect, useState, useRef } from "react";
import type { NPCBattleState } from "@/utils/types/npc";

type Props = {
  playerX: number;
  playerY: number;
  onAttack: () => void;
  isPaused?: boolean;
};

export function useNpcAI({ playerX, playerY, onAttack, isPaused }: Props) {
  const [npc, setNpc] = useState<NPCBattleState>({
    x: 900,
    y: 600,
    state: "walk",
    direction: "left", 
  });

  const attackRef = useRef(onAttack);
  attackRef.current = onAttack;
  const lastAttackRef = useRef(0); // 👈 AQUI

  useEffect(() => {
    const interval = setInterval(() => {
      setNpc((n) => {
        if (isPaused) return n;

        const distanceX = Math.abs(n.x - playerX);
        const distanceY = Math.abs(n.y - playerY); // 👈 aqui

        let newX = n.x;

        // 🧠 direção
        const direction = playerX < n.x ? "left" : "right";

        // 🏃 movimento
        if (distanceX > 200) {
          newX = n.x > playerX ? n.x - 8 : n.x + 8;
        }
        if (distanceX > 40 && distanceX <= 200) {
          newX = n.x > playerX ? n.x - 4 : n.x + 4;
        }

        // 👊 ataque (agora com validação em Y)
        const now = Date.now();

        const canAttack =
          distanceX <= 80 &&
          distanceY <= 39 &&
          now - lastAttackRef.current > 200; // cooldown de 0.5s

        if (canAttack) {
          attackRef.current();
          lastAttackRef.current = now;
        }

        return {
          ...n,
          x: newX,
          direction,
          state: distanceX > 80 ? "walk" : "idle",
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [playerX, playerY, isPaused]);

  return npc;
}