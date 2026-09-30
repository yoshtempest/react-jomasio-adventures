import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";
import { combatService } from "@/services/combat";
import type { ComputeHitDamageParams } from "./types";

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
    CHARACTER_ELEMENT_TYPES[player.character],
    npcElementTypes,
  );
  const trueDmg =
    Math.round(
      armorReduced * damageMultiplier * elementMultiplier * elementDamageBonus,
    ) + totalTrueDamage;

  return { damage: trueDmg, isCrit: dmgType === "crit", type: dmgType };
}
