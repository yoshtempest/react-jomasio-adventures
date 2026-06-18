import { useEffect, useState, useRef } from "react";
import { npcBehaviors } from "@/gameRules/battle/behaviors/npc/index";
import { useProjectile } from "./useProjectile";
import {
  getNpcDirection,
  getNpcState,
  applyObstacleCollision,
} from "@/gameRules/battle/npc/npcPosition";
import type { NPCBattleState } from "@/utils/types/npc/npc";
import type { BattleObstacle } from "@/utils/types/battleMap";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setNpc((n) => {
        if (isPausedRef.current) return n;
        if (hitstopRef.current > Date.now()) return n;

        if (npcStaggerRef.current > Date.now()) {
          return {
            ...n,
            direction: getNpcDirection(n.x, playerXRef.current),
            state: "walk",
          };
        }

        const behavior =
          npcBehaviors[npcTypeRef.current] || npcBehaviors.default;

        const result = behavior({
          npc: n,
          playerX: playerXRef.current,
          npcPhase: npcPhaseRef.current,
          playerY: playerYRef.current,
          projectile: projectileRef.current,
          setProjectile,
          lastAttackRef,
          onProjectileHit: onProjectileHitRef.current,
          onMeleeHit: onMeleeHitRef.current,
          setForceIdle,
          onSummon: onSummonRef.current,
          summonTimerRef,
        });

        const nextX = result.x;
        const nextY = result.y ?? n.y;
        const direction = getNpcDirection(nextX, playerXRef.current);
        const distanceX = Math.abs(n.x - playerXRef.current);
        const state = getNpcState(distanceX, forceIdleRef.current);
        const collision = applyObstacleCollision(
          nextX,
          nextY,
          obstaclesRef.current,
        );

        return { ...n, x: collision.x, y: collision.y, direction, state };
      });
    }, 20);

    return () => clearInterval(interval);
  }, [hitstopRef, npcStaggerRef]);

  return {
    ...npc,
    projectile,
    resetNpc,
  };
}
