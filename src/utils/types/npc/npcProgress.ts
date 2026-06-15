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
      common: { hp: 0.5, dmg: 0.15, armor: 1 },
      rare: { hp: 1.0, dmg: 0.35, armor: 3 },
      epic: { hp: 2.0, dmg: 0.80, armor: 6 },
      boss: { hp: 3.5, dmg: 1.50, armor: 10 },
      legendary: { hp: 25.0, dmg: 30.0, armor: 25 },
    },

    medium: {
      common: { hp: 1.5, dmg: 0.40, armor: 2 },
      rare: { hp: 3.0, dmg: 0.90, armor: 5 },
      epic: { hp: 5.0, dmg: 2.00, armor: 10 },
      boss: { hp: 8.0, dmg: 3.50, armor: 18 },
      legendary: { hp: 50.0, dmg: 60.0, armor: 40 },
    },

    hard: {
      common: { hp: 4.0, dmg: 1.00, armor: 4 },
      rare: { hp: 7.0, dmg: 2.20, armor: 8 },
      epic: { hp: 12.0, dmg: 4.50, armor: 15 },
      boss: { hp: 18.0, dmg: 7.00, armor: 28 },
      legendary: { hp: 100.0, dmg: 120.00, armor: 60 },
    },
  };

  const multipliers = difficultyMultipliers[difficulty][npcClass];

  return {
    hp: baseHp + level * multipliers.hp,
    damage: baseDamage + level * multipliers.dmg,
    armor: level * multipliers.armor,
  };
}

export type NPCData = {
  type: string;
  class: NPCClass;
};