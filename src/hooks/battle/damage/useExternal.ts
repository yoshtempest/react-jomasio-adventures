import { useCallback } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import type { SpawnDamageFn } from "@/utils/types/battle/spawnDamageFn";

type Props = {
  playerX: number;
  playerY: number;
  player: Player;
  totalArmor: number;
  blockGauge: number;
  playerShield: number;
  setPlayerHP: React.Dispatch<React.SetStateAction<number>>;
  setPlayerShield: React.Dispatch<React.SetStateAction<number>>;
  setBlockGauge: React.Dispatch<React.SetStateAction<number>>;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  spawnDamageRef: React.RefObject<SpawnDamageFn>;
  onBlockRef?: React.RefObject<() => void>;
  oneHitShieldRef?: React.RefObject<boolean>;
};

export function useExternalDamage({
  playerX,
  playerY,
  player,
  totalArmor,
  blockGauge,
  playerShield,
  setPlayerHP,
  setPlayerShield,
  setBlockGauge,
  setPlayer,
  spawnDamageRef,
  onBlockRef,
  oneHitShieldRef,
}: Props) {
  const playerShieldRef = useLatestRef(playerShield);

  const damagePlayerHp = useCallback(
    (damage: number) => {
      if (oneHitShieldRef?.current) {
        oneHitShieldRef.current = false;
        spawnDamageRef.current?.(0, playerX, playerY - 40, "blocked");
        return;
      }
      const shield = playerShieldRef.current;
      if (shield >= damage) {
        setPlayerShield((s) => s - damage);
        return;
      }
      setPlayerShield(0);
      const remaining = damage - shield;
      setPlayerHP((hp) => Math.max(0, hp - remaining));
    },
    [
      setPlayerHP,
      setPlayerShield,
      playerShieldRef,
      oneHitShieldRef,
      spawnDamageRef,
      playerX,
      playerY,
    ],
  );

  const damagePlayer = useCallback(
    (damage: number) => {
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
          damagePlayerHp(remaining);
          setPlayer((p) => ({ ...p, state: "stun" }));
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
    ],
  );

  return { damagePlayerHp, damagePlayer };
}
