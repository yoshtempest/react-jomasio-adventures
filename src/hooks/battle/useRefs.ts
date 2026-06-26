import { useRef } from "react";
import type { DamageType } from "@/hooks/battle/damage/useNumbers";

type SpawnDamageFn = (
  value: number,
  x: number,
  y: number,
  type: DamageType,
) => void;

export function useBattleRefs() {
  const npcRangedAttackRef = useRef<() => void>(() => {});
  const npcMeleeAttackRef = useRef<() => void>(() => {});
  const playerYRef = useRef(0);
  const hitstopRef = useRef(0);
  const npcStaggerRef = useRef(0);
  const spawnDamageRef = useRef<SpawnDamageFn>(() => {});
  const registerHitRef = useRef<(damage: number) => void>(() => {});

  return {
    npcRangedAttackRef,
    npcMeleeAttackRef,
    playerYRef,
    hitstopRef,
    npcStaggerRef,
    spawnDamageRef,
    registerHitRef,
  };
}
