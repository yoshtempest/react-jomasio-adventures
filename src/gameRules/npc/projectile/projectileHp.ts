import { getNpcVsPlayerMultiplier } from "@/gameRules/battle/npcVsPlayerDamage";
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
 *
 * Usado só para escalar a vida dos projéteis destrutíveis, então erro aqui
 * aparece como "o projétil morre com um golpe a mais ou a menos", nunca como
 * dano errado ao jogador.
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
  return Math.round(
    dmg * getNpcVsPlayerMultiplier(npcType, playerCharacter),
  );
}

/** Vida de um projétil destrutível: 1/3 do dano que causaria no jogador. */
export function getProjectileDestructionHp(projectedDamage: number): number {
  return Math.max(1, Math.round(projectedDamage / 3));
}
