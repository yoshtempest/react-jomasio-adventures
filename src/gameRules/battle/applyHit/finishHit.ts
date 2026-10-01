import { applyHitstop } from "@/gameRules/battle/time";
import type { BaseHitParams } from "./types";

export function finishHit(
  params: BaseHitParams & { npcX: number; npcY: number },
  damage: number,
  dmgType: DamageType,
  hitstop: number,
  onActionRef?: React.RefObject<() => void>,
) {
  params.spawnDamageRef.current?.(damage, params.npcX, params.npcY, dmgType);
  params.registerHitRef.current?.(damage);
  params.onDamageDealtRef?.current?.(damage);
  onActionRef?.current?.();
  params.timeRef.current = applyHitstop(params.timeRef.current, hitstop);

  // Só acerto com dano vale traits de on-hit: dano 0 (block) não empurra.
  if (damage > 0) params.onRaceHitRef?.current?.();

  if (params.totalVampirism > 0) {
    const heal = Math.round((damage * params.totalVampirism) / 100);
    if (heal > 0)
      params.setPlayerHP((hp) => Math.min(params.playerMaxHp, hp + heal));
  }
}
