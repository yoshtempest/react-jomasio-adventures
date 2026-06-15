// hooks/battle/useSummons.ts

import { useCallback, useRef, useState } from "react";

import { NPCS } from "@/data/npc";
import { getNpcStats } from "@/utils/types/npc/npcProgress";

import type { SummonedNpc } from "@/utils/types/npc/npc";

type Props = {
  npcLevel: number;
  difficulty: NpcDifficulty;
  playerX: number;
  playerGroundY: number;
};

const SPAWN_POSITIONS = [700, 1050];

export function useSummons({
  npcLevel,
  difficulty,
  playerX,
  playerGroundY,
}: Props) {
  const [summons, setSummons] = useState<SummonedNpc[]>([]);

  const npcXRef = useRef(900);

  const updateNpcPosition = useCallback((npcX: number) => {
    npcXRef.current = npcX;
  }, []);

  const summonNpc = useCallback(
    (npcType: string) => {
      const data = NPCS[npcType];

      if (!data) return;

      const maxHp = getNpcStats(
        npcLevel,
        data.class as NPCClass,
        difficulty,
      ).hp;

      const takenPositions = summons.map((summon) => summon.x);

      const freePosition = SPAWN_POSITIONS.find(
        (position) => !takenPositions.includes(position),
      );

      const spawnX = freePosition ?? npcXRef.current;

      setSummons((prev) => [
        ...prev,
        {
          id: `summon_${Date.now()}`,
          npcType,
          x: spawnX,
          y: playerGroundY,
          direction: spawnX < playerX ? "right" : "left",
          state: "walk",
          hp: maxHp,
          maxHp,
          isDying: false,
        },
      ]);
    },
    [summons, npcLevel, difficulty, playerGroundY, playerX],
  );

  const clearSummons = useCallback(() => {
    setSummons([]);
  }, []);

  return {
    summons,
    setSummons,
    summonNpc,
    clearSummons,
    updateNpcPosition,
  };
}
