import { useEffect, useState, useRef } from "react";
import { npcBehaviors } from "@/gameRules/battle/behaviors/npc/index";
import { useProjectile } from "./useProjectile";
import type { NPCBattleState } from "@/utils/types/npc/npc";
import type { Projectile } from "@/utils/types/projectile";


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

        return {
          ...n,
          x: result.x,
          y: result.y ?? n.y,
          direction,
          state: forceIdleRef.current ? "idle" : distanceX > 80 ? "walk" : "idle",
        };
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