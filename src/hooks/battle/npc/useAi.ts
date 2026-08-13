import { useEffect, useState, useRef, useCallback } from "react";
import { npcBehaviors } from "@/gameRules/battle/behaviors/npc/index";
import { useProjectile } from "./useProjectile";
import {
  getNpcDirection,
  getNpcState,
  applyObstacleCollision,
} from "@/gameRules/battle/npc/npcPosition";
import type { NPCBattleState } from "@/utils/types/npc/npc";
import type { BattleObstacle } from "@/utils/types/maps/battle";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { logPlay, logStop } from "@/utils/replay/audioEventLog";
import { BATTLE_SPAWN } from "@/gameRules/battle/spawnPoints";
import { BATTLE_LIMITS } from "@/utils/types/player/movement";

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
  npcHpRef?: React.RefObject<number>;
  npcMaxHpRef?: React.RefObject<number>;
  npcBlockedRef?: React.RefObject<boolean>;
  onGrabPlayer?: (flipped: boolean) => void;
  onThrowStart?: (npcX: number, npcDirection: "left" | "right") => void;
  onThrowPlayer?: (damageMultiplier: number) => void;
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
  npcHpRef,
  npcMaxHpRef,
  npcBlockedRef,
  onGrabPlayer,
  onThrowStart,
  onThrowPlayer,
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
  const loggedPlaySound = useCallback(
    (sound: Parameters<typeof playSound>[0], loop?: boolean) => {
      logPlay(sound, loop);
      playSound(sound, loop);
    },
    [playSound],
  );
  const jhowsimarSoundPlayingRef = useRef(false);
  const onGrabPlayerRef = useRef(onGrabPlayer);
  onGrabPlayerRef.current = onGrabPlayer;
  const onThrowStartRef = useRef(onThrowStart);
  onThrowStartRef.current = onThrowStart;
  const onThrowPlayerRef = useRef(onThrowPlayer);
  onThrowPlayerRef.current = onThrowPlayer;

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
      if (npcTypeRef.current === "vandinhaFragment") {
        playSound("breakDish");
        logPlay("breakDish");
      }
      if (npcTypeRef.current === "maurao") {
        playSound("knifeCut");
        logPlay("knifeCut");
      }
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

        const targetX = playerXRef.current;
        const targetY = playerYRef.current;

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
          playSound: loggedPlaySound,
          npcHp: npcHpRef?.current ?? 0,
          npcMaxHp: npcMaxHpRef?.current ?? 1,
          onGrabPlayer: (flipped) => onGrabPlayerRef.current?.(flipped),
          onThrowStart: (x, d) => onThrowStartRef.current?.(x, d),
          onThrowPlayer: (mult) => onThrowPlayerRef.current?.(mult),
        });

        const nextX = result.x;
        const nextY = result.y ?? n.y;
        const direction = getNpcDirection(nextX, playerXRef.current);
        const distanceX = Math.abs(n.x - playerXRef.current);

        if (npcTypeRef.current === "jhowsimar") {
          const inRange =
            distanceX <= 50 && Math.abs(playerYRef.current - n.y) <= 150;
          if (!inRange && !jhowsimarSoundPlayingRef.current) {
            jhowsimarSoundPlayingRef.current = true;
            playSound("jhowsimarVemCa", true);
            logPlay("jhowsimarVemCa", true);
          } else if (inRange && jhowsimarSoundPlayingRef.current) {
            jhowsimarSoundPlayingRef.current = false;
            stopSound("jhowsimarVemCa");
            logStop("jhowsimarVemCa");
          }
        }

        const collision = applyObstacleCollision(
          nextX,
          nextY,
          obstaclesRef.current,
        );

        return {
          ...n,
          x: Math.max(
            BATTLE_LIMITS.minX,
            Math.min(BATTLE_LIMITS.maxX, collision.x),
          ),
          y: collision.y,
          direction,
          state: (result.state ??
            getNpcState(
              distanceX,
              forceIdleRef.current,
            )) as NPCBattleState["state"],
        };
      });
    }, 20);

    return () => {
      clearInterval(interval);
      stopSound("jhowsimarVemCa");
      logStop("jhowsimarVemCa");
    };
  }, [
    hitstopRef,
    npcStaggerRef,
    npcPhaseRef,
    npcBlockedRef,
    npcHpRef,
    npcMaxHpRef,
    playSound,
    loggedPlaySound,
    stopSound,
  ]);

  const updateNpc = (partial: Partial<NPCBattleState>) => {
    setNpc((n) => ({
      ...n,
      ...partial,
      x:
        partial.x != null
          ? Math.max(
              BATTLE_LIMITS.minX,
              Math.min(BATTLE_LIMITS.maxX, partial.x),
            )
          : n.x,
    }));
  };

  return {
    ...npc,
    projectile,
    resetNpc,
    updateNpc,
  };
}
