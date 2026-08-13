import { useEffect, useRef, type RefObject } from "react";

type SyncProps = {
  battle: {
    npcHP: number;
    npcMaxHp: number;
    setNpcHP: (fn: (prev: number) => number) => void;
    isEnding: { readonly current: boolean };
    npcPhase: number;
  };
  npcAiHpRef: RefObject<number>;
  npc: { x: number };
  updateNpcPosition: (x: number) => void;
  npcType: string;
  npcMaxHpRef: RefObject<number>;
  setNpcHPRef: RefObject<(fn: (prev: number) => number) => void>;
  isEndingRef: RefObject<{ readonly current: boolean }>;
  setNpcPhase: (phase: number) => void;
  setModeRef: RefObject<(mode: PlayerMode) => void>;
  closeInventoryRef: RefObject<() => void>;
  closeNavbarRef: RefObject<() => void>;
  refs: {
    npcRangedAttackRef: RefObject<() => void>;
    npcMeleeAttackRef: RefObject<() => void>;
    npcThrowAttackRef: RefObject<() => void>;
  };
  charge: { cancelCharge: () => void };
  player: { state: string; halfHealUntil: number };
  halfHealReduction: number;
  battleNpcRangedHit: () => void;
  battleNpcMeleeHit: () => void;
  battleNpcThrowHit: (multiplier: number) => void;
};

export function useBattleSync({
  battle,
  npcAiHpRef,
  npc,
  updateNpcPosition,
  npcType,
  npcMaxHpRef,
  setNpcHPRef,
  isEndingRef,
  setNpcPhase,
  setModeRef,
  closeInventoryRef,
  closeNavbarRef,
  refs,
  charge,
  player,
  halfHealReduction,
  battleNpcRangedHit,
  battleNpcMeleeHit,
  battleNpcThrowHit,
}: SyncProps) {
  // NPC HP sync — lets AI behaviors read current NPC HP
  useEffect(() => {
    npcAiHpRef.current = battle.npcHP;
  }, [battle.npcHP, npcAiHpRef]);

  // Sync summon position to NPC position
  useEffect(() => {
    updateNpcPosition(npc.x);
  }, [npc.x, updateNpcPosition]);

  // Sync NPC phase state
  useEffect(() => {
    setNpcPhase(battle.npcPhase);
  }, [battle.npcPhase, setNpcPhase]);

  // Boss regen: hungryKing heals 1 HP/s in phase 2
  const halfHealUntilRef = useRef(player.halfHealUntil);
  halfHealUntilRef.current = player.halfHealUntil;

  useEffect(() => {
    if (npcType !== "hungryKing") return;
    if (battle.npcPhase !== 2) return;

    const interval = setInterval(() => {
      if (isEndingRef.current.current) return;
      const halfHealActive = halfHealUntilRef.current > Date.now();
      const heal = halfHealActive
        ? Math.max(0, Math.round(1 * (1 - halfHealReduction / 100)))
        : 1;
      if (heal <= 0) return;
      setNpcHPRef.current((hp: number) =>
        Math.min(npcMaxHpRef.current, hp + heal),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [npcType, battle.npcPhase, isEndingRef, setNpcHPRef, npcMaxHpRef, halfHealReduction]);

  // Wire ref callbacks so battle system can trigger NPC ranged/melee hit
  refs.npcRangedAttackRef.current = () => {
    if (player.state === "charging") charge.cancelCharge();
    battleNpcRangedHit();
  };
  refs.npcMeleeAttackRef.current = () => {
    if (player.state === "charging") charge.cancelCharge();
    battleNpcMeleeHit();
  };
  refs.npcThrowAttackRef.current = () => {
    battleNpcThrowHit(1.5);
  };

  // Set battle mode and close overlays on mount
  useEffect(() => {
    setModeRef.current("battle");
    closeInventoryRef.current();
    closeNavbarRef.current();
  }, [setModeRef, closeInventoryRef, closeNavbarRef]);
}
