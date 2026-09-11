import { useCallback } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import { isParryPress } from "@/hooks/battle/npc/useBlocking";
import type { SpawnDamageFn } from "@/utils/types/battle/spawnDamageFn";

type Props = {
  playerX: number;
  playerY: number;
  player: Player;
  totalArmor: number;
  blockGauge: number;
  playerShield: number;
  playerHP: number;
  setPlayerHP: React.Dispatch<React.SetStateAction<number>>;
  setPlayerShield: React.Dispatch<React.SetStateAction<number>>;
  setBlockGauge: React.Dispatch<React.SetStateAction<number>>;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  spawnDamageRef: React.RefObject<SpawnDamageFn>;
  onBlockRef?: React.RefObject<() => void>;
  oneHitShieldRef?: React.RefObject<boolean>;
  lastBlockPressRef: React.RefObject<number>;
  lastAttackPressRef?: React.RefObject<number>;
  onParry?: () => void;
  onDamageTaken?: () => void;
  /** Passiva O Abençoado: se retornar true, o golpe letal reduz a vida a 1. */
  surviveLethalHitRef?: React.RefObject<() => boolean>;
};

export function useExternalDamage({
  playerX,
  playerY,
  player,
  totalArmor,
  blockGauge,
  playerShield,
  playerHP,
  setPlayerHP,
  setPlayerShield,
  setBlockGauge,
  setPlayer,
  spawnDamageRef,
  onBlockRef,
  oneHitShieldRef,
  lastBlockPressRef,
  lastAttackPressRef,
  onParry,
  onDamageTaken,
  surviveLethalHitRef,
}: Props) {
  const playerShieldRef = useLatestRef(playerShield);
  const playerHPRef = useLatestRef(playerHP);
  const onDamageTakenRef = useLatestRef(onDamageTaken);

  const damagePlayerHp = useCallback(
    (damage: number): boolean => {
      onDamageTakenRef.current?.();
      if (oneHitShieldRef?.current) {
        oneHitShieldRef.current = false;
        spawnDamageRef.current?.(0, playerX, playerY - 40, "blocked");
        return false;
      }
      const shield = playerShieldRef.current;
      if (shield >= damage) {
        setPlayerShield((s) => s - damage);
        return false;
      }
      setPlayerShield(0);
      const remaining = damage - shield;
      if (
        playerHPRef.current - remaining <= 0 &&
        surviveLethalHitRef?.current?.()
      ) {
        setPlayerHP(1);
        return true;
      }
      setPlayerHP((hp) => Math.max(0, hp - remaining));
      return false;
    },
    [
      setPlayerHP,
      setPlayerShield,
      playerShieldRef,
      playerHPRef,
      oneHitShieldRef,
      spawnDamageRef,
      playerX,
      playerY,
      onDamageTakenRef,
      surviveLethalHitRef,
    ],
  );

  const damagePlayer = useCallback(
    (damage: number) => {
      if (isParryPress(lastBlockPressRef, lastAttackPressRef)) {
        onParry?.();
        onBlockRef?.current?.();
        spawnDamageRef.current?.(0, playerX, playerY - 40, "parry");
        return;
      }

      if (player.state === "blocked") {
        onBlockRef?.current?.();
        if (blockGauge > 0) {
          if (damage <= blockGauge) {
            setBlockGauge((g) => Math.max(0, g - damage));
            spawnDamageRef.current?.(0, playerX, playerY - 40, "blocked");
            return;
          }
          const remaining = damage - blockGauge;
          setBlockGauge(0);
          const survived = damagePlayerHp(remaining);
          if (!survived) {
            setPlayer((p) => ({ ...p, state: "stun" }));
          }
          spawnDamageRef.current?.(remaining, playerX, playerY, "summon");
          return;
        }

        const halved = Math.max(1, Math.round(damage / 2));
        damagePlayerHp(halved);
        spawnDamageRef.current?.(halved, playerX, playerY, "summon");
        return;
      }

      const reduced =
        totalArmor > 0
          ? Math.round((damage * 100) / (100 + totalArmor))
          : damage;
      damagePlayerHp(reduced);
      spawnDamageRef.current?.(reduced, playerX, playerY, "summon");
    },
    [
      player.state,
      blockGauge,
      playerX,
      playerY,
      totalArmor,
      setBlockGauge,
      setPlayer,
      damagePlayerHp,
      spawnDamageRef,
      onBlockRef,
      onParry,
      lastBlockPressRef,
      lastAttackPressRef,
    ],
  );

  return { damagePlayerHp, damagePlayer };
}
