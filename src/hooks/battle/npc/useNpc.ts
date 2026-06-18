import { useCallback } from "react";
import { getNpcStats } from "@/utils/types/npc/npcProgress";
import { calculateNpcDamage } from "@/gameRules/battle/damage";
import { isNpcInRange } from "@/gameRules/battle/range";
import { isFacingTarget } from "@/gameRules/battle/direction";
import type { DamageType } from "@/hooks/battle/useDamageNumbers";

type Props = {
  npcLevel: number;
  npcClass: NPCClass;
  playerClass: PlayerClass;

  playerX: number;
  playerY: number;
  npcX: number;
  npcY: number;

  player: Player;
  totalArmor: number;

  damagePlayerHp: (damage: number) => void;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  setNpcHP: React.Dispatch<React.SetStateAction<number>>;
  totalReflect: number;
  npcCooldown: React.RefObject<boolean>;
  difficulty: NpcDifficulty;
  isEnding: React.RefObject<boolean>;
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
  hitstopRef: React.RefObject<number>;
  npcStaggerRef: React.RefObject<number>;
  blockGauge: number;
  setBlockGauge: React.Dispatch<React.SetStateAction<number>>;
  lastBlockPressRef: React.MutableRefObject<number>;
};

function applyGuardBreak(
  remainingDmg: number,
  damagePlayerHp: (damage: number) => void,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >,
  playerX: number,
  playerY: number,
) {
  damagePlayerHp(remainingDmg);
  setPlayer((p) => ({ ...p, state: "stun" }));
  spawnDamageRef.current?.(remainingDmg, playerX, playerY, "npc");
}

function applyDesperateBlock(
  dmg: number,
  damagePlayerHp: (damage: number) => void,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >,
  playerX: number,
  playerY: number,
) {
  const halved = Math.max(1, Math.round(dmg / 2));
  damagePlayerHp(halved);
  setPlayer((p) => ({ ...p, state: "stun" }));
  spawnDamageRef.current?.(halved, playerX, playerY, "npc");
}

export function useNpcBattle({
  npcLevel,
  npcClass,
  playerClass,
  totalArmor,
  damagePlayerHp,
  setPlayer,
  setNpcHP,
  totalReflect,
  npcCooldown,
  playerX,
  playerY,
  npcX,
  npcY,
  player,
  difficulty,
  isEnding,
  spawnDamageRef,
  hitstopRef,
  npcStaggerRef,
  blockGauge,
  setBlockGauge,
  lastBlockPressRef,
}: Props) {
  const damagePlayerWithReflect = useCallback((damage: number) => {
    damagePlayerHp(damage);
    if (damage > 0) {
      const reflectPct = Math.min(totalReflect, 10);
      if (reflectPct > 0) {
        const reflectAmt = Math.round(damage * reflectPct / 100);
        if (reflectAmt > 0) {
          setNpcHP((hp) => Math.max(0, hp - reflectAmt));
          spawnDamageRef.current?.(reflectAmt, npcX, npcY, "reflect");
        }
      }
    }
  }, [damagePlayerHp, totalReflect, setNpcHP, spawnDamageRef, npcX, npcY]);

  const npcMeleeHit = useCallback(() => {
    if (isEnding.current) return;
    if (!npcCooldown.current) return;
    if (!isNpcInRange(playerX, playerY, npcX, npcY)) return;
    if (player.state === "dash") return;

    const npc = getNpcStats(npcLevel, npcClass, difficulty);
    const baseDmg = npc.damage;
    const dmg = calculateNpcDamage(baseDmg, playerClass, totalArmor);

    const isBlocking =
      player.state === "blocked" &&
      isFacingTarget(playerX, playerY, npcX, npcY, player.battleDirection);

    if (isBlocking) {
      if (blockGauge > 0) {
        if (dmg <= blockGauge) {
          setBlockGauge((g) => Math.max(0, g - dmg));
          hitstopRef.current = Date.now() + 60;
          npcStaggerRef.current = Date.now() + 500;
          spawnDamageRef.current?.(0, playerX, playerY - 40, "blocked");
          npcCooldown.current = false;
          setTimeout(() => (npcCooldown.current = true), 500);
          return;
        }

        const remaining = dmg - blockGauge;
        setBlockGauge(0);
        applyGuardBreak(
          remaining,
          damagePlayerWithReflect,
          setPlayer,
          spawnDamageRef,
          playerX,
          playerY,
        );
        hitstopRef.current = Date.now() + 80;
        npcCooldown.current = false;
        setTimeout(() => (npcCooldown.current = true), 800);
        return;
      }

      const halved = Math.max(1, Math.round(dmg / 2));
      damagePlayerWithReflect(halved);
      spawnDamageRef.current?.(halved, playerX, playerY, "npc");
      hitstopRef.current = Date.now() + 40;
      npcCooldown.current = false;
      setTimeout(() => (npcCooldown.current = true), 500);
      return;
    }

    const recentBlock =
      lastBlockPressRef.current > 0 &&
      Date.now() - lastBlockPressRef.current < 300;

    if (recentBlock) {
      applyDesperateBlock(
        dmg,
        damagePlayerWithReflect,
        setPlayer,
        spawnDamageRef,
        playerX,
        playerY,
      );
      hitstopRef.current = Date.now() + 60;
      npcCooldown.current = false;
      setTimeout(() => (npcCooldown.current = true), 600);
      return;
    }

    damagePlayerWithReflect(dmg);
    navigator.vibrate?.(40);
    spawnDamageRef.current?.(dmg, playerX, playerY, "npc");
    hitstopRef.current = Date.now() + 50;

    npcCooldown.current = false;
    setTimeout(() => (npcCooldown.current = true), 800);
  }, [
    isEnding,
    npcCooldown,
    player.state,
    player.battleDirection,
    npcLevel,
    npcClass,
    playerClass,
    totalArmor,
    setPlayer,
    playerX,
    playerY,
    npcX,
    npcY,
    difficulty,
    spawnDamageRef,
    hitstopRef,
    npcStaggerRef,
    blockGauge,
    setBlockGauge,
    lastBlockPressRef,
    damagePlayerWithReflect,
  ]);

  const npcRangedHit = useCallback(() => {
    if (isEnding.current) return;
    if (!npcCooldown.current) return;
    if (player.state === "dash") return;

    const npc = getNpcStats(npcLevel, npcClass, difficulty);
    const baseDmg = npc.damage;
    const dmg = calculateNpcDamage(baseDmg, playerClass, totalArmor);

    const isBlocking =
      player.state === "blocked" &&
      isFacingTarget(playerX, playerY, npcX, npcY, player.battleDirection);

    if (isBlocking) {
      if (blockGauge > 0) {
        if (dmg <= blockGauge) {
          setBlockGauge((g) => Math.max(0, g - dmg));
          hitstopRef.current = Date.now() + 60;
          npcStaggerRef.current = Date.now() + 500;
          spawnDamageRef.current?.(0, playerX, playerY - 40, "blocked");
          npcCooldown.current = false;
          setTimeout(() => (npcCooldown.current = true), 500);
          return;
        }

        const remaining = dmg - blockGauge;
        setBlockGauge(0);
        applyGuardBreak(
          remaining,
          damagePlayerWithReflect,
          setPlayer,
          spawnDamageRef,
          playerX,
          playerY,
        );
        hitstopRef.current = Date.now() + 80;
        npcCooldown.current = false;
        setTimeout(() => (npcCooldown.current = true), 800);
        return;
      }

      const halved = Math.max(1, Math.round(dmg / 2));
      damagePlayerWithReflect(halved);
      spawnDamageRef.current?.(halved, playerX, playerY, "npc");
      hitstopRef.current = Date.now() + 40;
      npcCooldown.current = false;
      setTimeout(() => (npcCooldown.current = true), 500);
      return;
    }

    const recentBlock =
      lastBlockPressRef.current > 0 &&
      Date.now() - lastBlockPressRef.current < 300;

    if (recentBlock) {
      applyDesperateBlock(
        dmg,
        damagePlayerWithReflect,
        setPlayer,
        spawnDamageRef,
        playerX,
        playerY,
      );
      hitstopRef.current = Date.now() + 50;
      npcCooldown.current = false;
      setTimeout(() => (npcCooldown.current = true), 600);
      return;
    }

    damagePlayerWithReflect(dmg);
    navigator.vibrate?.(40);
    spawnDamageRef.current?.(dmg, playerX, playerY, "npc");
    hitstopRef.current = Date.now() + 30;

    npcCooldown.current = false;
    setTimeout(() => (npcCooldown.current = true), 800);
  }, [
    isEnding,
    npcCooldown,
    player.state,
    player.battleDirection,
    npcLevel,
    npcClass,
    playerClass,
    setPlayer,
    playerX,
    playerY,
    npcX,
    npcY,
    difficulty,
    totalArmor,
    spawnDamageRef,
    hitstopRef,
    npcStaggerRef,
    blockGauge,
    setBlockGauge,
    lastBlockPressRef,
    damagePlayerWithReflect,
  ]);

  return { npcMeleeHit, npcRangedHit };
}
