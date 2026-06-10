import type { NPCClass } from "@/utils/types/npc/npcProgress";
import type { EquipmentRank } from "@/utils/types/player/equipment";

type DropConfig = {
  baseChance: number;
  rankWeights: Record<EquipmentRank, number>;
};

export const DROP_CONFIG: Record<NPCClass, DropConfig> = {
  common: {
    baseChance: 0.03,
    rankWeights: {
      common: 80,
      rare: 15,
      epic: 4,
      boss: 0.9,
      legendary: 0.1,
    },
  },

  rare: {
    baseChance: 0.08,
    rankWeights: {
      common: 55,
      rare: 30,
      epic: 10,
      boss: 4,
      legendary: 1,
    },
  },

  epic: {
    baseChance: 0.15,
    rankWeights: {
      common: 25,
      rare: 35,
      epic: 25,
      boss: 10,
      legendary: 5,
    },
  },

  boss: {
    baseChance: 0.25,
    rankWeights: {
      common: 5,
      rare: 20,
      epic: 35,
      boss: 30,
      legendary: 10,
    },
  },

  legendary: {
    baseChance: 0.40,
    rankWeights: {
      common: 1,
      rare: 4,
      epic: 15,
      boss: 30,
      legendary: 50,
    },
  },
};

const RANKS: EquipmentRank[] = ["common", "rare", "epic", "boss", "legendary"];

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
