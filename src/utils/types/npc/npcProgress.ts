export type NPCClass = "common" | "rare" | "epic" | "boss" | "legendary";
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
      common: { hp: 0.2, dmg: 0.08 },
      rare: { hp: 0.5, dmg: 0.20 },
      epic: { hp: 1.2, dmg: 0.50 },
      boss: { hp: 2.5, dmg: 1.20 },
      legendary: { hp: 4.0, dmg: 2.00 },
    },

    medium: {
      common: { hp: 0.8, dmg: 0.30 },
      rare: { hp: 1.8, dmg: 0.70 },
      epic: { hp: 3.5, dmg: 1.50 },
      boss: { hp: 6.0, dmg: 2.80 },
      legendary: { hp: 10.0, dmg: 4.00 },
    },

    hard: {
      common: { hp: 2.0, dmg: 0.80 },
      rare: { hp: 4.0, dmg: 1.80 },
      epic: { hp: 7.0, dmg: 3.00 },
      boss: { hp: 12.0, dmg: 5.00 },
      legendary: { hp: 18.0, dmg: 9.00 },
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