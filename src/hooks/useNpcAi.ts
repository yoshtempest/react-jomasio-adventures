import { useEffect, useState } from "react";
import type { NPCBattleState } from "@/utils/types/npc";

export function useNpcAI(playerX: number) {
  const [npc, setNpc] = useState<NPCBattleState>({
    x: 900,
    y: 600,
    state: "idle",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setNpc((n) => {
        const distance = Math.abs(n.x - playerX);

        if (distance > 60) {
          return {
            ...n,
            x: n.x > playerX ? n.x - 4 : n.x + 4,
            state: "walk",
          };
        }

        return { ...n, state: "idle" };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [playerX]);

  return npc;
}