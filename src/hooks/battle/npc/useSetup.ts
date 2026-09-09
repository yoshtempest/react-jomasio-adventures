import { useState } from "react";
import { NPCS, isNpcType, type NPCData } from "@/data/npc/npc";
import { getNpcStats } from "@/gameRules/npc/npcStats";

type NpcSetupResult = {
  npcData: NPCData;
  npcLevel: number;
  npcStats: ReturnType<typeof getNpcStats>;
};

export function useNpcSetup(
  npcType: string,
  difficulty: NpcDifficulty,
  npcLevel: number,
  multiplier: number = 1,
): NpcSetupResult {
  const npcData = isNpcType(npcType) ? NPCS[npcType] : NPCS.dummy;
  const [level] = useState(() => npcLevel);
  const npcStats = getNpcStats(level, npcData.class, difficulty, multiplier);

  return { npcData, npcLevel: level, npcStats };
}
