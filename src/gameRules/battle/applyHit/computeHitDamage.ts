import { getCharacterElementTypesAtLevel } from "@/data/types/characterElementTypes";
import { getCharacterTraitSummary } from "@/data/characters/races/traits";
import { combatService } from "@/services/combat";
import type { ComputeHitDamageParams } from "./types";

/**
 * Funil único do dano do player contra NPC: básico, especial e tudo que
 * reaproveita `applyBasicHit`/`applySpecialHit` sai daqui.
 *
 * É também o único lugar que resolve tipagem **com nível** — sem isso o
 * despertar racial existiria só na ficha.
 */
export function computeHitDamage({
  player,
  char,
  critRate,
  npcArmor,
  npcElementTypes,
  playerHP,
  playerMaxHp,
  totalMaxHpDamage,
  totalTrueDamage,
  damageMultiplier,
  elementDamageBonus,
  rawDmg,
}: ComputeHitDamageParams): {
  damage: number;
  isCrit: boolean;
  type: DamageType;
} {
  const maxHpBonus = combatService.calculateMaxHpBonus(
    playerMaxHp,
    totalMaxHpDamage,
  );
  const dmgWithHpBonus = rawDmg + maxHpBonus;
  const berserkDmg =
    player.character === "samuel" && char.level >= 20
      ? Math.round(
          dmgWithHpBonus *
            combatService.getBerserkMultiplier(playerHP, playerMaxHp),
        )
      : dmgWithHpBonus;
  const { damage: critDmg, type: dmgType } = combatService.rollCrit(
    berserkDmg,
    critRate,
  );
  const armorReduced = combatService.calculateDamageToNpc(critDmg, npcArmor);
  const elementMultiplier = combatService.getElementMultiplier(
    getCharacterElementTypesAtLevel(player.character, char.level),
    npcElementTypes,
  );
  const raceDamageMultiplier = getCharacterTraitSummary(
    player.character,
  ).damageDealtMultiplier;
  const trueDmg =
    Math.round(
      armorReduced *
        damageMultiplier *
        elementMultiplier *
        elementDamageBonus *
        raceDamageMultiplier,
    ) + totalTrueDamage;

  return { damage: trueDmg, isCrit: dmgType === "crit", type: dmgType };
}
