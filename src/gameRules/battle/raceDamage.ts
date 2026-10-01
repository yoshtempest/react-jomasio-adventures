import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import { getCharacterElementTypesAtLevel } from "@/data/types/characterElementTypes";
import { getNpcTraitSummary } from "@/data/types/npcRaceTraits";
import { getCharacterTraitSummary } from "@/data/characters/races/traits";
import { combatService } from "@/services/combat";

/**
 * Multiplicador total do dano de um NPC contra o player: elemental + traits dos
 * dois lados.
 *
 * Havia uma cópia da fórmula elemental em cada caminho de golpe NPC→player
 * (`rollNpcDamage`, `npcThrowHit`, projétil destrutível, summons). Cada cópia
 * que não conhecesse traits raciais ou o despertar por nível virava um bug
 * silencioso — o golpe ignorava o escudo da raça. Centralizar aqui é a mesma
 * razão do funil de `CombatService.getElementMultiplier`.
 */
export function getNpcVsPlayerMultiplier(
  npcType: string,
  playerCharacter: CharacterId,
  playerLevel: number,
): number {
  return (
    combatService.getElementMultiplier(
      getNpcElementTypes(npcType),
      getCharacterElementTypesAtLevel(playerCharacter, playerLevel),
    ) *
    getNpcTraitSummary(npcType).damageDealtMultiplier *
    getCharacterTraitSummary(playerCharacter).damageTakenMultiplier
  );
}
