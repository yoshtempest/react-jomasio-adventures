import { useEffect, useState, useRef } from "react";
import { npcBehaviors } from "@/gameRules/battle/behaviors/npc/index";
import { CROUCHED_STATES } from "@/gameRules/movement/battle";
import { useProjectile } from "./useProjectile";
import {
  getNpcDirection,
  getNpcState,
  applyObstacleCollision,
} from "@/gameRules/battle/npc/npcPosition";
import type { NPCBattleState } from "@/utils/types/npc/npc";
import type { BattleObstacle } from "@/utils/types/maps/battle";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { BATTLE_SPAWN } from "@/gameRules/battle/spawnPoints";

type Props = {
  playerX: number;
  playerY: number;
  playerState: playerState;
  playerDirection: Direction;
  onProjectileHit: () => void;
  onMeleeHit: () => void;
  isPaused?: boolean;
  npcType: string;
  npcPhaseRef: React.RefObject<number>;
  onSummon?: (npcType: string) => void;
  onPullPlayer?: (x: number) => void;
  obstacles?: BattleObstacle[];
  hitstopRef: React.RefObject<number>;
  npcStaggerRef: React.RefObject<number>;
  petXRef?: React.RefObject<number>;
  petYRef?: React.RefObject<number>;
  hasPetRef?: React.RefObject<boolean>;
  npcTargetIsPetRef?: React.RefObject<boolean>;
  npcHpRef?: React.RefObject<number>;
  npcMaxHpRef?: React.RefObject<number>;
  npcBlockedRef?: React.RefObject<boolean>;
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
  npcPhaseRef,
  onSummon,
  onPullPlayer,
  obstacles,
  hitstopRef,
  npcStaggerRef,
  petXRef,
  petYRef,
  hasPetRef,
  npcTargetIsPetRef,
  npcHpRef,
  npcMaxHpRef,
  npcBlockedRef,
}: Props) {
  const [npc, setNpc] = useState<NPCBattleState>({
    x: BATTLE_SPAWN.npc.x,
    y: BATTLE_SPAWN.npc.y,
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
  const playerStateRef = useRef<PlayerState>(playerState as PlayerState);
  playerStateRef.current = playerState as PlayerState;
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
  const onPullPlayerRef = useRef(onPullPlayer);
  onPullPlayerRef.current = onPullPlayer;
  const lastAttackRef = useRef(0);
  const summonTimerRef = useRef(0);
  const obstaclesRef = useRef(obstacles ?? []);
  obstaclesRef.current = obstacles ?? [];

  const { playSound, stopSound } = useSoundEffects();
  const playSoundRef = useRef(playSound);
  playSoundRef.current = playSound;
  const stopSoundRef = useRef(stopSound);
  stopSoundRef.current = stopSound;
  const jhowsimarSoundPlayingRef = useRef(false);


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
    onPullPlayer,
  );

  const resetNpc = (stateOverride?: NPCBattleState["state"]) => {
    setNpc({
      x: BATTLE_SPAWN.npc.x,
      y: BATTLE_SPAWN.npc.y,
      state: stateOverride ?? "walk",
      direction: "left",
    });

    setProjectile(null);
    lastAttackRef.current = 0;
  };

  useEffect(() => {
    function getTarget(n: NPCBattleState) {
      const isCrouched = CROUCHED_STATES.has(playerStateRef.current);

      if (hasPetRef?.current) {
        const px = petXRef?.current ?? 0;
        const py = petYRef?.current ?? 0;

        if (isCrouched) {
          return { targetX: px, targetY: py, targetIsPet: true };
        }

        const petDist = Math.hypot(px - n.x, py - n.y);
        const playerDist = Math.hypot(playerXRef.current - n.x, playerYRef.current - n.y);

        if (petDist < playerDist) {
          return { targetX: px, targetY: py, targetIsPet: true };
        }
      }

      return {
        targetX: playerXRef.current,
        targetY: playerYRef.current,
        targetIsPet: false,
      };
    }

    const interval = setInterval(() => {
      setNpc((n) => {
        if (isPausedRef.current) return n;
        if (hitstopRef.current > Date.now()) return n;

        if (npcBlockedRef?.current) {
          return {
            ...n,
            state: "block" as NPCBattleState["state"],
          };
        }

        if (npcStaggerRef.current > Date.now()) {
          return {
            ...n,
            direction: getNpcDirection(n.x, playerXRef.current),
          };
        }

        const behavior =
          npcBehaviors[npcTypeRef.current] || npcBehaviors.default;

        const { targetX, targetY, targetIsPet } = getTarget(n);

        // expose target info for npc melee/ranged hit
        if (npcTargetIsPetRef) {
          npcTargetIsPetRef.current = targetIsPet;
        }

        const result = behavior({
          npc: n,
          playerX: playerXRef.current,
          playerY: playerYRef.current,
          targetX,
          targetY,
          npcPhase: npcPhaseRef.current,
          projectile: projectileRef.current,
          setProjectile,
          lastAttackRef,
          onProjectileHit: onProjectileHitRef.current,
          onMeleeHit: onMeleeHitRef.current,
          setForceIdle,
          onSummon: onSummonRef.current,
          onPullPlayer: onPullPlayerRef.current,
          summonTimerRef,
          playSound: (sound, loop) => playSoundRef.current(sound, loop),
          npcHp: npcHpRef?.current ?? 0,
          npcMaxHp: npcMaxHpRef?.current ?? 1,
        });

        const nextX = result.x;
        const nextY = result.y ?? n.y;
        const direction = getNpcDirection(nextX, playerXRef.current);
        const distanceX = Math.abs(n.x - playerXRef.current);

        if (npcTypeRef.current === "jhowsimar") {
          const inRange = distanceX <= 50 && Math.abs(playerYRef.current - n.y) <= 150;
          if (!inRange && !jhowsimarSoundPlayingRef.current) {
            jhowsimarSoundPlayingRef.current = true;
            playSoundRef.current("jhowsimarVemCa", true);
          } else if (inRange && jhowsimarSoundPlayingRef.current) {
            jhowsimarSoundPlayingRef.current = false;
            stopSoundRef.current("jhowsimarVemCa");
          }
        }

        const collision = applyObstacleCollision(
          nextX,
          nextY,
          obstaclesRef.current,
        );

        return { ...n, x: collision.x, y: collision.y, direction, state: (result.state ?? getNpcState(distanceX, forceIdleRef.current)) as NPCBattleState["state"] };
      });
    }, 20);

    return () => {
      clearInterval(interval);
      stopSoundRef.current("jhowsimarVemCa");
    };
  }, [hitstopRef, npcStaggerRef, npcPhaseRef, npcTargetIsPetRef, hasPetRef, petXRef, petYRef, npcBlockedRef]);

  const updateNpc = (partial: Partial<NPCBattleState>) => {
    setNpc((n) => ({ ...n, ...partial }));
  };

  return {
    ...npc,
    projectile,
    resetNpc,
    updateNpc,
  };
}
