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

const SPAWN_POSITIONS = [550, 850, 1150];

export function useSummons({
  npcLevel,
  difficulty,
  playerX,
  playerGroundY,
}: Props) {
  const [summons, setSummons] = useState<SummonedNpc[]>([]);

  const npcXRef = useRef(900);
  const nextSpawnIndex = useRef(0);

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

      const spawnX = SPAWN_POSITIONS[nextSpawnIndex.current % SPAWN_POSITIONS.length] ?? npcXRef.current;
      nextSpawnIndex.current += 1;

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
    [npcLevel, difficulty, playerGroundY, playerX],
  );

  const clearSummons = useCallback(() => {
    setSummons([]);
    nextSpawnIndex.current = 0;
  }, []);

  return {
    summons,
    setSummons,
    summonNpc,
    clearSummons,
    updateNpcPosition,
  };
}
