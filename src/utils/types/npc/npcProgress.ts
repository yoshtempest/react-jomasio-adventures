export type NPCClass = "common" | "rare" | "epic" | "boss";
export type NpcDifficulty = "easy" | "medium" | "hard";


export function getNpcStats(
  level: number,
  npcClass: NPCClass,
  difficulty: NpcDifficulty
) {
  const baseHp = 90;
  const baseDamage = 5;

  const difficultyMultipliers = {
    easy: {
      common: { hp: 1, dmg: 0.25 },
      rare: { hp: 2.5, dmg: 0.5 },
      epic: { hp: 4.5, dmg: 1 },
      boss: { hp: 7.5, dmg: 2 },
    },

    medium: {
      common: { hp: 2, dmg: 0.5 },
      rare: { hp: 4, dmg: 1 },
      epic: { hp: 8, dmg: 2 },
      boss: { hp: 12, dmg: 3 },
    },

    hard: {
      common: { hp: 2, dmg: 1 },
      rare: { hp: 5, dmg: 2 },
      epic: { hp: 9, dmg: 3 },
      boss: { hp: 15, dmg: 6 },
    },
  };

  const multipliers = difficultyMultipliers[difficulty][npcClass];

  return {
    hp: baseHp + level * multipliers.hp,
    damage: baseDamage + level * multipliers.dmg,
  };
}

export type NPCData = {
  type: string;
  class: NPCClass;
};