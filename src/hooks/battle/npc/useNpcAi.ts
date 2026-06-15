import { useEffect, useState, useRef } from "react";
import { npcBehaviors } from "@/gameRules/battle/behaviors/npc/index";
import { useProjectile } from "./useProjectile";
import { isHorizontallyBlocked } from "@/utils/types/battleMap";
import type { NPCBattleState } from "@/utils/types/npc/npc";
import type { Projectile } from "@/utils/types/projectile";
import type { BattleObstacle } from "@/utils/types/battleMap";
import type { DamageType } from "@/hooks/battle/useDamageNumbers";

type Props = {
  playerX: number;
  playerY: number;
  playerState: playerState;
  playerDirection: Direction;
  onProjectileHit: () => void;
  onMeleeHit: () => void;
  isPaused?: boolean;
  npcType: string;
  npcPhase: number;
  onSummon?: (npcType: string) => void;
  obstacles?: BattleObstacle[];
  hitstopRef: React.RefObject<number>;
  npcStaggerRef: React.RefObject<number>;
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
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
  npcPhase,
  onSummon,
  obstacles,
  hitstopRef,
  npcStaggerRef,
  spawnDamageRef,
}: Props) {
  const [npc, setNpc] = useState<NPCBattleState>({
    x: 900,
    y: 670,
    state: "walk",
    direction: "left",
  });

  const [projectile, setProjectile] = useState<Projectile | null>(null);
  const [forceIdle, setForceIdle] = useState(false);

  const projectileRef = useRef(projectile);
  projectileRef.current = projectile;
  const playerXRef = useRef(playerX);
  playerXRef.current = playerX;
  const playerYRef = useRef(playerY);
  playerYRef.current = playerY;
  const npcPhaseRef = useRef(npcPhase);
  npcPhaseRef.current = npcPhase;
  const forceIdleRef = useRef(forceIdle);
  forceIdleRef.current = forceIdle;
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const npcTypeRef = useRef(npcType);
  npcTypeRef.current = npcType;
  const onProjectileHitRef = useRef(onProjectileHit);
  onProjectileHitRef.current = onProjectileHit;
  const onMeleeHitRef = useRef(onMeleeHit);
  onMeleeHitRef.current = onMeleeHit;
  const onSummonRef = useRef(onSummon);
  onSummonRef.current = onSummon;
  const lastAttackRef = useRef(0);
  const summonTimerRef = useRef(0);
  const obstaclesRef = useRef(obstacles ?? []);
  obstaclesRef.current = obstacles ?? [];
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
    },
    hitstopRef,
    () => {
      spawnDamageRef.current?.(0, playerX, playerY - 40, "blocked");
      npcStaggerRef.current = Date.now() + 400;
    },
  );

  const resetNpc = () => {
    setNpc({
      x: 900,
      y: 670,
      state: "walk",
      direction: "left",
    });

    setProjectile(null);
    lastAttackRef.current = 0;
  };

  const hitstopRef_ = hitstopRef;
  const npcStaggerRef_ = npcStaggerRef;

  useEffect(() => {
    const interval = setInterval(() => {
      setNpc((n) => {
        if (isPausedRef.current) return n;
        if (hitstopRef_.current > Date.now()) return n;

        if (npcStaggerRef_.current > Date.now()) {
          const direction = playerXRef.current < n.x ? "left" : "right";
          return { ...n, direction, state: "walk" };
        }

        const p = projectileRef.current;

        const behavior =
          npcBehaviors[npcTypeRef.current] || npcBehaviors.default;

        const result = behavior({
          npc: n,
          playerX: playerXRef.current,
          npcPhase: npcPhaseRef.current,
          playerY: playerYRef.current,
          projectile: p,
          setProjectile,
          lastAttackRef,
          onProjectileHit: onProjectileHitRef.current,
          onMeleeHit: onMeleeHitRef.current,
          setForceIdle,
          onSummon: onSummonRef.current,
          summonTimerRef,
        });

        const direction = playerXRef.current < n.x ? "left" : "right";
        const distanceX = Math.abs(n.x - playerXRef.current);
        const state = forceIdleRef.current
          ? "idle"
          : distanceX > 80
            ? "walk"
            : "idle";
        const nextX = result.x;
        const nextY = result.y ?? n.y;

        const obstacles = obstaclesRef.current;
        if (obstacles.length > 0) {
          const npcLeft = nextX - 15;
          const npcTop = nextY - 50;
          const npcRight = nextX + 15;
          const npcBottom = nextY;

          if (
            isHorizontallyBlocked(
              npcLeft,
              npcTop,
              npcRight,
              npcBottom,
              obstacles,
            )
          ) {
            return { ...n, y: nextY, direction, state };
          }
        }

        return { ...n, x: nextX, y: nextY, direction, state };
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return {
    ...npc,
    projectile,
    resetNpc,
  };
}
