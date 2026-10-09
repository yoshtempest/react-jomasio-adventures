import { useMemo, useState } from "react";
import { NPCS, isNpcType, type NPCData } from "@/data/npc";
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
  // Memoizado: `getNpcStats` aloca um objeto novo (inclusive `armor`) a cada
  // chamada. Sem `useMemo`, cada render do consumidor criava identidade nova e
  // effects que dependem de `npcStats.armor` (ex.: o setBattleInfo do
  // useBattleStageSetup) re-disparavam a cada render → loop de updates de
  // profundidade máxima. Durante a batalha esses inputs são fixos de qualquer
  // forma; o memo só evita recalcular/alocar.
  const npcStats = useMemo(
    () => getNpcStats(level, npcData.class, difficulty, multiplier, npcType),
    [level, npcData.class, difficulty, multiplier, npcType],
  );

  return { npcData, npcLevel: level, npcStats };
}
