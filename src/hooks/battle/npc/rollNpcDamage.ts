import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";
import { combatService } from "@/services/combat";

export function rollNpcDamage(
  dmg: number,
  hpRatio: number,
  npcType: string,
  npcPhase: number,
  playerCharacter: CharacterId,
): { finalDmg: number; dmgType: DamageType } {
  const clampedRatio = Math.max(0, Math.min(1, hpRatio));
  let critChance = 1;
  if (npcType === "slimita" && npcPhase >= 2) {
    critChance = 1 + (1 - clampedRatio) * 9;
  }
  const isCrit = Math.random() * 100 < critChance;
  const elementMultiplier = combatService.getElementMultiplier(
    getNpcElementTypes(npcType),
    CHARACTER_ELEMENT_TYPES[playerCharacter],
  );
  const finalDmg = Math.round((isCrit ? dmg * 2 : dmg) * elementMultiplier);
  const dmgType: DamageType = isCrit ? "crit" : "npc";
  return { finalDmg, dmgType };
}