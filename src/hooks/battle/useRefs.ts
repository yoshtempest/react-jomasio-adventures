import { useRef } from "react";
import type { SpawnDamageFn } from "@/utils/types/battle/spawnDamageFn";


export function useBattleRefs() {
  const npcRangedAttackRef = useRef<() => void>(() => {});
  const npcMeleeAttackRef = useRef<() => void>(() => {});
  const npcThrowAttackRef = useRef<() => void>(() => {});
  const playerYRef = useRef(0);
  const hitstopRef = useRef(0);
  const npcStaggerRef = useRef(0);
  const spawnDamageRef = useRef<SpawnDamageFn>(() => {});
  const registerHitRef = useRef<(damage: number) => void>(() => {});

  return {
    npcRangedAttackRef,
    npcMeleeAttackRef,
    npcThrowAttackRef,
    playerYRef,
    hitstopRef,
    npcStaggerRef,
    spawnDamageRef,
    registerHitRef,
  };
}
