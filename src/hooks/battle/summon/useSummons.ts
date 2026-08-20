import { useCallback, useRef, useState } from "react";

import { NPCS, isNpcType } from "@/data/npc/npc";
import { getNpcStats } from "@/gameRules/npc/npcStats";

import type { SummonedNpc } from "@/utils/types/npc/npc";

type Props = {
  npcLevel: number;
  difficulty: NpcDifficulty;
  playerX: number;
  playerGroundY: number;
};

const SPAWN_POSITIONS = [550, 650, 750];

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
    (npcType: string, overrideX?: number) => {
      if (!isNpcType(npcType)) return;

      const data = NPCS[npcType];

      const maxHp = getNpcStats(npcLevel, data.class, difficulty).hp;

      const spawnX =
        overrideX ??
        SPAWN_POSITIONS[nextSpawnIndex.current % SPAWN_POSITIONS.length] ??
        npcXRef.current;
      nextSpawnIndex.current += 1;

      const spawnId = nextSpawnIndex.current;

      setSummons((prev) => [
        ...prev,
        {
          id: `summon_${Date.now()}_${spawnId}`,
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
