import { useState } from "react";
import { NPCS, isNpcType, type NPCData } from "@/data/npc/npc";
import { generateNpcLevel } from "@/gameRules/battle/generateNpcLevel";
import { getNpcStats } from "@/gameRules/npc/npcStats";

type NpcSetupResult = {
  npcData: NPCData;
  npcLevel: number;
  npcStats: ReturnType<typeof getNpcStats>;
};

export function useNpcSetup(
  npcType: string,
  difficulty: NpcDifficulty,
  playerLevel: number = 1,
  multiplier: number = 1,
): NpcSetupResult {
  const npcData = isNpcType(npcType) ? NPCS[npcType] : NPCS.dummy;
  const [npcLevel] = useState(() => generateNpcLevel(playerLevel));
  const npcStats = getNpcStats(npcLevel, npcData.class, difficulty, multiplier);

  return { npcData, npcLevel, npcStats };
}
