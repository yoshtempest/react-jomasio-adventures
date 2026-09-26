import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";
import { combatService } from "@/services/combat";

type ProjectProjectileDamageParams = {
  npcDamage: number;
  playerClass: PlayerClass;
  totalArmor: number;
  npcType: string;
  playerCharacter: CharacterId;
};

/**
 * Dano determinístico que um projétil causaria caso acertasse o jogador,
 * espelhando o pipeline de `npcRangedHit` (base do NPC + redução de armadura
 * + multiplicador elemental) sem a aleatoriedade de crítico.
 */
export function projectProjectileDamage({
  npcDamage,
  playerClass,
  totalArmor,
  npcType,
  playerCharacter,
}: ProjectProjectileDamageParams): number {
  const dmg = combatService.calculateNpcDamage(
    npcDamage,
    playerClass,
    totalArmor,
  );
  const elementMultiplier = combatService.getElementMultiplier(
    getNpcElementTypes(npcType),
    CHARACTER_ELEMENT_TYPES[playerCharacter],
  );
  return Math.round(dmg * elementMultiplier);
}

/** Vida de um projétil destrutível: 1/3 do dano que causaria no jogador. */
export function getProjectileDestructionHp(projectedDamage: number): number {
  return Math.max(1, Math.round(projectedDamage / 3));
}