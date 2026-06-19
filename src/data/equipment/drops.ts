type DropConfig = {
  baseChance: number;
  rankWeights: Record<EquipmentRank, number>;
};

export const DROP_CONFIG: Record<NPCClass, DropConfig> = {
  common: {
    baseChance: 0.08,
    rankWeights: {
      1: 50,
      2: 30,
      3: 13,
      4: 5,
      5: 2,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      0: 0,
      EX: 0,
    },
  },

  rare: {
    baseChance: 0.15,
    rankWeights: {
      1: 15,
      2: 30,
      3: 25,
      4: 15,
      5: 10,
      6: 4,
      7: 1,
      8: 0,
      9: 0,
      0: 0,
      EX: 0,
    },
  },

  epic: {
    baseChance: 0.35,
    rankWeights: {
      1: 5,
      2: 10,
      3: 20,
      4: 20,
      5: 20,
      6: 12,
      7: 8,
      8: 4,
      9: 1,
      0: 0,
      EX: 0,
    },
  },

  boss: {
    baseChance: 0.55,
    rankWeights: {
      1: 0,
      2: 5,
      3: 10,
      4: 15,
      5: 20,
      6: 18,
      7: 15,
      8: 10,
      9: 5,
      0: 2,
      EX: 0,
    },
  },

  legendary: {
    baseChance: 0.8,
    rankWeights: {
      1: 0,
      2: 0,
      3: 2,
      4: 5,
      5: 10,
      6: 15,
      7: 20,
      8: 18,
      9: 15,
      0: 10,
      EX: 5,
    },
  },
};

const SLOT_CHANCE: Record<NPCClass, number> = {
  common: 0.15,
  rare: 0.25,
  epic: 0.4,
  boss: 0.55,
  legendary: 0.7,
};

const RANKS: EquipmentRank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "EX"];

function pickWeighted(weights: Record<EquipmentRank, number>): EquipmentRank {
  let total = 0;
  for (const r of RANKS) {
    total += weights[r];
  }
  if (total <= 0) return 1;

  let roll = Math.random() * total;
  for (const rank of RANKS) {
    roll -= weights[rank];
    if (roll <= 0) return rank;
  }

  return 1;
}

export function rollDrop(npcClass: NPCClass): EquipmentRank | null {
  const config = DROP_CONFIG[npcClass];
  if (!config) return null;

  if (Math.random() > config.baseChance) return null;

  const totalWeight = Object.values(config.rankWeights).reduce(
    (a, b) => a + b,
    0,
  );
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
