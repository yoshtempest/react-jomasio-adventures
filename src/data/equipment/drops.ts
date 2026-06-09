import type { NPCClass } from "@/utils/types/npc/npcProgress";
import type { EquipmentRank } from "@/utils/types/player/equipment";

type DropConfig = {
  baseChance: number;
  rankWeights: Record<EquipmentRank, number>;
};

export const DROP_CONFIG: Record<NPCClass, DropConfig> = {
  common: {
    baseChance: 0.03,
    rankWeights: { common: 1, rare: 0, epic: 0, legendary: 0 },
  },
  rare: {
    baseChance: 0.08,
    rankWeights: { common: 0.5, rare: 0.5, epic: 0, legendary: 0 },
  },
  epic: {
    baseChance: 0.15,
    rankWeights: { common: 0.15, rare: 0.35, epic: 0.5, legendary: 0 },
  },
  boss: {
    baseChance: 0.25,
    rankWeights: { common: 0, rare: 0.1, epic: 0.5, legendary: 0.4 },
  },
  legendary: {
    baseChance: 0.40,
    rankWeights: { common: 0, rare: 0, epic: 0.2, legendary: 0.8 },
  },
};

const RANKS: EquipmentRank[] = ["common", "rare", "epic", "legendary"];

function pickWeighted(weights: Record<EquipmentRank, number>): EquipmentRank {
  const total = RANKS.reduce((sum, r) => sum + weights[r], 0);
  if (total <= 0) return "common";

  let roll = Math.random() * total;
  for (const rank of RANKS) {
    roll -= weights[rank];
    if (roll <= 0) return rank;
  }

  return "common";
}

export function rollDrop(npcClass: NPCClass): EquipmentRank | null {
  const config = DROP_CONFIG[npcClass];
  if (!config) return null;

  if (Math.random() > config.baseChance) return null;

  const totalWeight = Object.values(config.rankWeights).reduce((a, b) => a + b, 0);
  if (totalWeight <= 0) return null;

  return pickWeighted(config.rankWeights);
}

export function getDropChanceText(npcClass: NPCClass): string {
  const config = DROP_CONFIG[npcClass];
  if (!config) return "0%";

  return `${(config.baseChance * 100).toFixed(0)}%`;
}
