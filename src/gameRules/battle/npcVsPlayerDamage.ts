import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import { getCharacterElementTypes } from "@/data/types/characterElementTypes";
import { combatService } from "@/services/combat";

/**
 * Multiplicador total do dano de um NPC contra o player (elemental).
 *
 * Havia uma cópia da fórmula elemental em cada caminho de golpe NPC→player
 * (`rollNpcDamage`, `npcThrowHit`, projétil destrutível, summons). Centralizar
 * aqui é a mesma razão do funil de `CombatService.getElementMultiplier`: uma
 * cópia que não conhecesse a tipagem do personagem viraria bug silencioso.
 */
export function getNpcVsPlayerMultiplier(
  npcType: string,
  playerCharacter: CharacterId,
): number {
  return combatService.getElementMultiplier(
    getNpcElementTypes(npcType),
    getCharacterElementTypes(playerCharacter),
  );
}
