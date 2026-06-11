import type { NPCClass } from "@/utils/types/npc/npcProgress";
import type { EquipmentRank } from "@/utils/types/player/equipment";

type DropConfig = {
  baseChance: number;
  rankWeights: Record<EquipmentRank, number>;
};

export const DROP_CONFIG: Record<NPCClass, DropConfig> = {
  common: {
    baseChance: 0.08,
    rankWeights: {
      common: 85,
      rare: 13,
      epic: 2,
      boss: 0,
      legendary: 0,
    },
  },

  rare: {
    baseChance: 0.15,
    rankWeights: {
      common: 65,
      rare: 28,
      epic: 6,
      boss: 1,
      legendary: 0,
    },
  },

  epic: {
    baseChance: 0.35,
    rankWeights: {
      common: 35,
      rare: 35,
      epic: 22,
      boss: 7,
      legendary: 1,
    },
  },

  boss: {
    baseChance: 0.55,
    rankWeights: {
      common: 15,
      rare: 30,
      epic: 32,
      boss: 18,
      legendary: 5,
    },
  },

  legendary: {
    baseChance: 0.80,
    rankWeights: {
      common: 2,
      rare: 8,
      epic: 25,
      boss: 30,
      legendary: 35,
    },
  },
};

const SLOT_CHANCE: Record<NPCClass, number> = {
  common: 0.15,
  rare: 0.25,
  epic: 0.40,
  boss: 0.55,
  legendary: 0.70,
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

export function rollSlotDrop(npcClass: NPCClass): EquipmentRank | null {
  const config = DROP_CONFIG[npcClass];
  if (!config) return null;

  if (Math.random() > SLOT_CHANCE[npcClass]) return null;

  return pickWeighted(config.rankWeights);
}

export function getDropChanceText(npcClass: NPCClass): string {
  const config = DROP_CONFIG[npcClass];
  if (!config) return "0%";

  return `${(config.baseChance * 100).toFixed(0)}%`;
}
