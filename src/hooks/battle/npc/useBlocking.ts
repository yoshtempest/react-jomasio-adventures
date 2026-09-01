import {
  NPC_BLOCK_COOLDOWN,
  NPC_GUARD_BREAK_COOLDOWN,
  NPC_RECENT_BLOCK_COOLDOWN,
} from "@/data/cooldowns";
import type { SpawnDamageFn } from "@/utils/types/battle/spawnDamageFn";

/**
 * Janela de tempo (ms) entre pressionar o bloqueio e sofrer o dano para o
 * parry disparar. Precisa ser um toque bem no timing do hit (0-50ms antes).
 */
export const PARRY_WINDOW_MS = 50;

export function isParryPress(
  lastBlockPressRef: React.RefObject<number>,
): boolean {
  const pressTime = lastBlockPressRef.current;
  if (pressTime <= 0) return false;
  return Date.now() - pressTime <= PARRY_WINDOW_MS;
}

export function applyGuardBreak(
  remainingDmg: number,
  damagePlayerHp: (damage: number) => void,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  spawnDamageRef: React.RefObject<SpawnDamageFn>,
  playerX: number,
  playerY: number,
) {
  damagePlayerHp(remainingDmg);
  setPlayer((p) => ({ ...p, state: "stun" }));
  spawnDamageRef.current?.(remainingDmg, playerX, playerY, "npc");
}

export function applyDesperateBlock(
  dmg: number,
  damagePlayerHp: (damage: number) => void,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  spawnDamageRef: React.RefObject<SpawnDamageFn>,
  playerX: number,
  playerY: number,
) {
  const halved = Math.max(1, Math.round(dmg / 2));
  damagePlayerHp(halved);
  setPlayer((p) => ({ ...p, state: "stun" }));
  spawnDamageRef.current?.(halved, playerX, playerY, "npc");
}

type HandleBlockingParams = {
  dmg: number;
  isBlocking: boolean;
  blockGauge: number;
  setBlockGauge: React.Dispatch<React.SetStateAction<number>>;
  damagePlayerWithReflect: (damage: number) => void;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  spawnDamageRef: React.RefObject<SpawnDamageFn>;
  playerX: number;
  playerY: number;
  hitstopRef: React.RefObject<number>;
  npcStaggerRef: React.RefObject<number>;
  npcCooldown: React.RefObject<boolean>;
  lastBlockPressRef: React.RefObject<number>;
  onFullBlock?: () => void;
  onBlockRef?: React.RefObject<() => void>;
  onParry?: () => void;
};

export function handleNpcBlocking({
  dmg,
  isBlocking,
  blockGauge,
  setBlockGauge,
  damagePlayerWithReflect,
  setPlayer,
  spawnDamageRef,
  playerX,
  playerY,
  hitstopRef,
  npcStaggerRef,
  npcCooldown,
  lastBlockPressRef,
  onFullBlock,
  onBlockRef,
  onParry,
}: HandleBlockingParams): boolean {
  const now = Date.now();
  const pressTime = lastBlockPressRef.current;
  const sincePress = pressTime > 0 ? now - pressTime : Infinity;

  if (sincePress <= PARRY_WINDOW_MS) {
    onParry?.();
    spawnDamageRef.current?.(0, playerX, playerY - 40, "parry");
    hitstopRef.current = now + 80;
    npcStaggerRef.current = now + 500;
    npcCooldown.current = false;
    onFullBlock?.();
    onBlockRef?.current?.();
    setTimeout(() => (npcCooldown.current = true), NPC_BLOCK_COOLDOWN);
    return true;
  }

  if (isBlocking) {
    if (blockGauge > 0) {
      if (dmg <= blockGauge) {
        setBlockGauge((g) => Math.max(0, g - dmg));
        hitstopRef.current = Date.now() + 60;
        npcStaggerRef.current = Date.now() + 500;
        spawnDamageRef.current?.(0, playerX, playerY - 40, "blocked");
        npcCooldown.current = false;
        onFullBlock?.();
        onBlockRef?.current?.();
        setTimeout(() => (npcCooldown.current = true), NPC_BLOCK_COOLDOWN);
        return true;
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
      onBlockRef?.current?.();
      setTimeout(() => (npcCooldown.current = true), NPC_GUARD_BREAK_COOLDOWN);
      return true;
    }

    const halved = Math.max(1, Math.round(dmg / 2));
    damagePlayerWithReflect(halved);
    spawnDamageRef.current?.(halved, playerX, playerY, "npc");
    hitstopRef.current = Date.now() + 40;
    npcCooldown.current = false;
    onBlockRef?.current?.();
    setTimeout(() => (npcCooldown.current = true), NPC_BLOCK_COOLDOWN);
    return true;
  }

  const recentBlock = sincePress < 300;

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
    onBlockRef?.current?.();
    setTimeout(() => (npcCooldown.current = true), NPC_RECENT_BLOCK_COOLDOWN);
    return true;
  }

  return false;
}
