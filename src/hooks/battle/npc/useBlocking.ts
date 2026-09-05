import {
  NPC_BLOCK_COOLDOWN,
  NPC_GUARD_BREAK_COOLDOWN,
  NPC_RECENT_BLOCK_COOLDOWN,
} from "@/data/cooldowns";
import type { SpawnDamageFn } from "@/utils/types/battle/spawnDamageFn";
import { FIFTY_MS, ONE_THOUSAND_FIVE_HUNDRED_MS } from "@/data/ms";

/**
 * Janela de tempo (ms) entre a entrada do jogador e sofrer o dano para o
 * parry disparar. Precisa ser um toque bem no timing do hit (0-50ms antes).
 */
export const PARRY_WINDOW_MS = FIFTY_MS;

/** Tempo em que o NPC fica impedido de atacar depois de levar um parry. */
export const PARRY_STAGGER_MS = ONE_THOUSAND_FIVE_HUNDRED_MS;

/**
 * Tempo desde a entrada de parry mais recente.
 *
 * Bloquear e atacar valem igual: as duas entradas abrem a janela, então o
 * jogador pode dar o parry defendendo no timing ou atacando junto com o
 * golpe do NPC.
 */
export function timeSinceParryInput(
  ...pressRefs: (React.RefObject<number> | undefined)[]
): number {
  const now = Date.now();
  let elapsed = Infinity;

  for (const ref of pressRefs) {
    const pressTime = ref?.current ?? 0;
    if (pressTime <= 0) continue;
    elapsed = Math.min(elapsed, now - pressTime);
  }

  return elapsed;
}

export function isParryPress(
  ...pressRefs: (React.RefObject<number> | undefined)[]
): boolean {
  return timeSinceParryInput(...pressRefs) <= PARRY_WINDOW_MS;
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
  lastAttackPressRef?: React.RefObject<number>;
  onFullBlock?: () => void;
  onBlockRef?: React.RefObject<() => void>;
  onParry?: () => void;
  onDamageBlocked?: (blockedDamage: number) => void;
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
  lastAttackPressRef,
  onFullBlock,
  onBlockRef,
  onParry,
  onDamageBlocked,
}: HandleBlockingParams): boolean {
  const now = Date.now();
  const sincePress = timeSinceParryInput(lastBlockPressRef, lastAttackPressRef);

  if (sincePress <= PARRY_WINDOW_MS) {
    onParry?.();
    spawnDamageRef.current?.(0, playerX, playerY - 40, "parry");
    hitstopRef.current = now + 80;
    npcStaggerRef.current = now + PARRY_STAGGER_MS;
    npcCooldown.current = false;
    onFullBlock?.();
    onBlockRef?.current?.();
    setTimeout(() => (npcCooldown.current = true), PARRY_STAGGER_MS);
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
        onDamageBlocked?.(dmg);
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
