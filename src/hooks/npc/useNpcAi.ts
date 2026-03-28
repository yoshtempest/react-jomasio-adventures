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
  });

  // 🔥 REF resolve o loop infinito
  const attackRef = useRef(onAttack);
  attackRef.current = onAttack;

  useEffect(() => {
    const interval = setInterval(() => {
      setNpc((n) => {
        const distance = Math.abs(n.x - playerX);

        let newX = n.x;

        // 🏃 movimento
        if (distance > 50) {
          newX = n.x > playerX ? n.x - 4 : n.x + 4;
        }

        // 👊 ataque
        if (distance <= 60) {
          attackRef.current(); // ✅ seguro
        }

        return {
          ...n,
          x: newX,
          state: distance > 50 ? "walk" : "idle",
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [playerX]); // 🚫 NÃO depende de onAttack

  return npc;
}