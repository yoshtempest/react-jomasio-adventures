export type NPCClass = "common" | "rare" | "boss";


export function getNpcStats(level: number, npcClass: NPCClass) {
  const baseHp = 90;
  const baseDamage = 10;

  const multipliers = {
    common: { hp: 10, dmg: 1 },
    rare: { hp: 15, dmg: 2 },
    boss: { hp: 30, dmg: 4 },
  };

  return {
    hp: baseHp + level * multipliers[npcClass].hp,
    damage: baseDamage + level * multipliers[npcClass].dmg,
  };
}

export type NPCData = {
  type: string; // ex: "slime", "teacher", etc
  class: NPCClass;
};