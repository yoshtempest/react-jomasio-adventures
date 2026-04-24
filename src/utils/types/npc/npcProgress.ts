export type NPCClass = "common" | "rare" | "boss";


export function getNpcStats(level: number, npcClass: NPCClass) {
  const baseHp = 90;
  const baseDamage = 5;

  const multipliers = {
    common: { hp: 2, dmg: 0.5 },
    rare: { hp: 5, dmg: 1 },
    boss: { hp: 10, dmg: 2 },
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