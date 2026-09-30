import { combatService } from "@/services/combat";
import { computeHitDamage } from "./computeHitDamage";
import type { DamageCalcParams } from "./types";

export function calculateSpecialHitDamage(
  params: Omit<DamageCalcParams, "titleDamageBonus"> & { stacks: number },
): { damage: number; isCrit: boolean; type: DamageType } {
  let rawDmg: number;
  if (params.player.character === "larissa") {
    rawDmg = params.stacks * 5;
  } else {
    const baseSpecial = combatService.calculateSpecialDamage(
      params.char.stats.intelligence,
      params.playerClass,
    );
    rawDmg =
      params.player.character === "riquelme" ? baseSpecial * 2 : baseSpecial;
  }

  return computeHitDamage({ ...params, rawDmg });
}
