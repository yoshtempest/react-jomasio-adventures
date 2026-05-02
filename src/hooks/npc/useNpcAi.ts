import { useEffect, useState, useRef } from "react";
import { npcBehaviors } from "@/gameRules/battle/behaviors/npc/index";
import { useProjectile } from "../useProjectile";
import type { NPCBattleState } from "@/utils/types/npc/npc";
import type { Projectile } from "@/utils/types/projectile";
import type { DirectionBattle } from "@/utils/types/player/player";


type Props = {
  playerX: number;
  playerY: number;
  playerState: string;
  playerDirection: DirectionBattle;
  onProjectileHit: () => void;
  onMeleeHit: () => void;  
  isPaused?: boolean;
  npcType: string;
};

export function useNpcAI({
  playerX,
  playerY,
  playerState,
  playerDirection,
  onMeleeHit,
  onProjectileHit,
  isPaused,
  npcType,
}: Props) {
  const [npc, setNpc] = useState<NPCBattleState>({
    x: 900,
    y: 600,
    state: "walk",
    direction: "left",
  });

  const [projectile, setProjectile] = useState<Projectile | null>(null);
  const [forceIdle, setForceIdle] = useState(false);

  const lastAttackRef = useRef(0);
  useProjectile(
    projectile,
    setProjectile,
    playerX,
    playerY,
    playerState,
    playerDirection,
    npc.x,
    npc.y,
    () => {
    onProjectileHit();
  });

  const resetNpc = () => {
    setNpc({
      x: 900,
      y: 600,
      state: "walk",
      direction: "left",
    });

    setProjectile(null);
    lastAttackRef.current = 0;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNpc((n) => {
        if (isPaused) return n;

        const behavior =
          npcBehaviors[npcType] || npcBehaviors.default;

        const result = behavior({
          npc: n,
          playerX,
          playerY,
          projectile,
          setProjectile,
          lastAttackRef,
          onProjectileHit,
          onMeleeHit,
          setForceIdle,
        });

        const direction = playerX < n.x ? "left" : "right";
        const distanceX = Math.abs(n.x - playerX);

        return {
          ...n,
          x: result.x,
          direction,
          state: forceIdle ? "idle" : distanceX > 80 ? "walk" : "idle",
        };
      });
    }, 20);

    return () => clearInterval(interval);
  },
  [
    playerX,
    playerY,
    isPaused,
    npcType,
    projectile,
    forceIdle,
    onProjectileHit,
    onMeleeHit,
  ]);

  return {
    ...npc,
    projectile,
    resetNpc,
  };
}