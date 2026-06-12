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
      common: { hp: 0.5, dmg: 0.15 },
      rare: { hp: 1.0, dmg: 0.35 },
      epic: { hp: 2.0, dmg: 0.80 },
      boss: { hp: 3.5, dmg: 1.50 },
      legendary: { hp: 25.0, dmg: 30.0 },
    },

    medium: {
      common: { hp: 1.5, dmg: 0.40 },
      rare: { hp: 3.0, dmg: 0.90 },
      epic: { hp: 5.0, dmg: 2.00 },
      boss: { hp: 8.0, dmg: 3.50 },
      legendary: { hp: 50.0, dmg: 60.0 },
    },

    hard: {
      common: { hp: 4.0, dmg: 1.00 },
      rare: { hp: 7.0, dmg: 2.20 },
      epic: { hp: 12.0, dmg: 4.50 },
      boss: { hp: 18.0, dmg: 7.00 },
      legendary: { hp: 100.0, dmg: 120.00 },
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