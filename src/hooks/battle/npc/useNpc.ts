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

  setPlayerHP: React.Dispatch<React.SetStateAction<number>>;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  npcCooldown: React.RefObject<boolean>;
  difficulty: NpcDifficulty;
  isEnding: React.RefObject<boolean>;
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
  hitstopRef: React.RefObject<number>;
  npcStaggerRef: React.RefObject<number>;
  blockLimit: number;
  lastBlockPressRef: React.MutableRefObject<number>;
};

function applyGuardBreak(
  remainingDmg: number,
  setPlayerHP: React.Dispatch<React.SetStateAction<number>>,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >,
  playerX: number,
  playerY: number,
) {
  setPlayerHP((hp) => Math.max(0, hp - remainingDmg));
  setPlayer((p) => ({ ...p, state: "stun" }));
  spawnDamageRef.current?.(remainingDmg, playerX, playerY, "npc");
}

function applyDesperateBlock(
  dmg: number,
  setPlayerHP: React.Dispatch<React.SetStateAction<number>>,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >,
  playerX: number,
  playerY: number,
) {
  const halved = Math.max(1, Math.round(dmg / 2));
  setPlayerHP((hp) => Math.max(0, hp - halved));
  setPlayer((p) => ({ ...p, state: "stun" }));
  spawnDamageRef.current?.(halved, playerX, playerY, "npc");
}

export function useNpcBattle({
  npcLevel,
  npcClass,
  playerClass,
  totalArmor,
  setPlayerHP,
  setPlayer,
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
  blockLimit,
  lastBlockPressRef,
}: Props) {
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
      if (dmg <= blockLimit) {
        hitstopRef.current = Date.now() + 60;
        npcStaggerRef.current = Date.now() + 500;
        spawnDamageRef.current?.(0, playerX, playerY - 40, "blocked");
        npcCooldown.current = false;
        setTimeout(() => (npcCooldown.current = true), 500);
        return;
      }

      const remaining = dmg - blockLimit;
      applyGuardBreak(
        remaining,
        setPlayerHP,
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

    const recentBlock =
      lastBlockPressRef.current > 0 &&
      Date.now() - lastBlockPressRef.current < 300;

    if (recentBlock) {
      applyDesperateBlock(
        dmg,
        setPlayerHP,
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

    setPlayerHP((hp) => Math.max(0, hp - dmg));
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
    setPlayerHP,
    setPlayer,
    playerX,
    playerY,
    npcX,
    npcY,
    difficulty,
    spawnDamageRef,
    hitstopRef,
    npcStaggerRef,
    blockLimit,
    lastBlockPressRef,
  ]);

  const npcRangedHit = useCallback(() => {
    if (isEnding.current) return;
    if (!npcCooldown.current) return;
    if (player.state === "dash") return;

    const isBlocking =
      player.state === "blocked" &&
      isFacingTarget(playerX, playerY, npcX, npcY, player.battleDirection);

    if (isBlocking) {
      hitstopRef.current = Date.now() + 60;
      npcStaggerRef.current = Date.now() + 500;
      spawnDamageRef.current?.(0, playerX, playerY - 40, "blocked");
      npcCooldown.current = false;
      setTimeout(() => (npcCooldown.current = true), 500);
      return;
    }

    const npc = getNpcStats(npcLevel, npcClass, difficulty);
    const baseDmg = npc.damage;
    const dmg = calculateNpcDamage(baseDmg, playerClass, totalArmor);

    const recentBlock =
      lastBlockPressRef.current > 0 &&
      Date.now() - lastBlockPressRef.current < 300;

    if (recentBlock) {
      applyDesperateBlock(
        dmg,
        setPlayerHP,
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

    setPlayerHP((hp) => Math.max(0, hp - dmg));
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
    setPlayerHP,
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
    lastBlockPressRef,
  ]);

  return { npcMeleeHit, npcRangedHit };
}
