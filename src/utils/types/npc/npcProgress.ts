export type NPCClass = "common" | "rare" | "epic" | "boss";


export function getNpcStats(level: number, npcClass: NPCClass) {
  const baseHp = 90;
  const baseDamage = 5;

  const multipliers = {
    common: { hp: 2, dmg: 1 },
    rare: { hp: 5, dmg: 2 },
    epic: { hp: 9, dmg: 3 },
    boss: { hp: 15, dmg: 6 },
  };

  return {
    hp: baseHp + level * multipliers[npcClass].hp,
    damage: baseDamage + level * multipliers[npcClass].dmg,
  };
}

export type NPCData = {
  type: string;
  class: NPCClass;
};