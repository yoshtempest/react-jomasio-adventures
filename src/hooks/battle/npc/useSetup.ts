import { useState } from "react";
import { NPCS } from "@/data/npc/npc";
import { generateNpcLevel } from "@/utils/types/battle/generateNpcLevel";
import { getNpcStats } from "@/utils/types/npc/npcProgress";

type NpcSetupResult = {
  npcData: (typeof NPCS)[string];
  npcLevel: number;
  npcStats: ReturnType<typeof getNpcStats>;
};

export function useNpcSetup(
  npcType: string,
  difficulty: NpcDifficulty,
  playerLevel: number = 1,
): NpcSetupResult {
  const npcData = NPCS[npcType];
  const [npcLevel] = useState(() => generateNpcLevel(playerLevel));
  const npcStats = getNpcStats(npcLevel, npcData.class, difficulty);

  return { npcData, npcLevel, npcStats };
}
