import { getCharacterElementTypes } from "@/data/types/characterElementTypes";
import { combatService } from "@/services/combat";
import type { ComputeHitDamageParams } from "./types";

/**
 * Funil único do dano do player contra NPC: básico, especial e tudo que
 * reaproveita `applyBasicHit`/`applySpecialHit` sai daqui.
 *
 * Ordem das reduções (importante: `damageKind` decide a armadura, e a armadura
 * vem antes de qualquer multiplicador):
 * HP máximo → fúria do samuel → crítico → **armadura da coluna do golpe** →
 * elemental → multiplicadores da habilidade → **+ dano verdadeiro do equipamento**
 * (por último e sem escala, porque é o que existe para furar armadura).
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
  damageKind,
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
  const armorReduced = combatService.applyArmor(critDmg, damageKind, npcArmor);
  const elementMultiplier = combatService.getElementMultiplier(
    getCharacterElementTypes(player.character),
    npcElementTypes,
  );
  const trueDmg =
    Math.round(
      armorReduced * damageMultiplier * elementMultiplier * elementDamageBonus,
    ) + totalTrueDamage;

  return { damage: trueDmg, isCrit: dmgType === "crit", type: dmgType };
}
