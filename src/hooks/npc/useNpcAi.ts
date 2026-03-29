import { useEffect, useState, useRef } from "react";
import type { NPCBattleState } from "@/utils/types/npc";

type Props = {
  playerX: number;
  onAttack: () => void;
};

export function useNpcAI({ playerX, onAttack }: Props) {
  const [npc, setNpc] = useState<NPCBattleState>({
    x: 900,
    y: 600,
    state: "idle",
    direction: "right", 
  });

  const attackRef = useRef(onAttack);
  attackRef.current = onAttack;

  useEffect(() => {
    const interval = setInterval(() => {
      setNpc((n) => {
        const distance = Math.abs(n.x - playerX);

        let newX = n.x;

        // 🧠 define direção
        const direction = playerX < n.x ? "left" : "right";

        // 🏃 movimento
        if (distance > 200) {
          newX = n.x > playerX ? n.x - 8 : n.x + 8;
        }

        if (distance > 40 && distance <= 200) {
          newX = n.x > playerX ? n.x - 4 : n.x + 4;
        }

        // 👊 ataque
        if (distance <= 80) {
          attackRef.current();
        }

        return {
          ...n,
          x: newX,
          direction, // 👈 IMPORTANTE
          state: distance > 80 ? "walk" : "idle",
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [playerX]);

  return npc;
}