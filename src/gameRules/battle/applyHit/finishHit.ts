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


  if (params.totalVampirism > 0) {
    const heal = Math.round((damage * params.totalVampirism) / 100);
    if (heal > 0)
      params.setPlayerHP((hp) => Math.min(params.playerMaxHp, hp + heal));
  }
}
