export function getNpcStats(
  level: number,
  npcClass: NPCClass,
  difficulty: NpcDifficulty,
) {
  const baseHp = 90;
  const baseDamage = 5;

  const difficultyMultipliers = {
    easy: {
      common: { hp: 0.5, dmg: 0.15, armor: 1 },
      rare: { hp: 1.0, dmg: 0.35, armor: 3 },
      epic: { hp: 2.0, dmg: 0.8, armor: 6 },
      boss: { hp: 3.5, dmg: 1.5, armor: 10 },
      legendary: { hp: 25.0, dmg: 30.0, armor: 25 },
    },

    medium: {
      common: { hp: 1.5, dmg: 0.4, armor: 2 },
      rare: { hp: 3.0, dmg: 0.9, armor: 5 },
      epic: { hp: 5.0, dmg: 2.0, armor: 10 },
      boss: { hp: 6.0, dmg: 3, armor: 15 },
      legendary: { hp: 50.0, dmg: 60.0, armor: 40 },
    },

    hard: {
      common: { hp: 4.0, dmg: 1.0, armor: 4 },
      rare: { hp: 7.0, dmg: 2.2, armor: 8 },
      epic: { hp: 12.0, dmg: 4.5, armor: 15 },
      boss: { hp: 15.0, dmg: 5.0, armor: 28 },
      legendary: { hp: 80.0, dmg: 50.0, armor: 45 },
    },

    insano: {
      common: { hp: 10.0, dmg: 2.5, armor: 10 },
      rare: { hp: 18.0, dmg: 6.0, armor: 20 },
      epic: { hp: 30.0, dmg: 12.0, armor: 36 },
      boss: { hp: 50.0, dmg: 20.0, armor: 64 },
      legendary: { hp: 160.0, dmg: 100.0, armor: 90 },
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
