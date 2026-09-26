import { useEffect, useState, useRef, useCallback } from "react";
import { getNpcAttack } from "@/services/npc";
import { useProjectile } from "./useProjectile";
import { isParryPress } from "@/hooks/battle/npc/isParryPress";
import {
  getNpcDirection,
  getNpcState,
  applyObstacleCollision,
} from "@/gameRules/battle/npc/npcPosition";
import type { NPCBattleState } from "@/utils/types/npc/npc";
import type { BattleObstacle } from "@/utils/types/maps/battle";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { logPlay, logStop } from "@/utils/replay/audioEventLog";
import { BATTLE_SPAWN } from "@/gameRules/battle/spawnPoints";
import { BATTLE_LIMITS } from "@/gameRules/movement/constants";
import {
  HONORED_ONE_FLEE_DISTANCE,
  HONORED_ONE_FLEE_STEP,
} from "@/gameRules/battle/cursedEnergy";
import type { NewPlayerStatus } from "@/gameRules/battle/status/statusEffects";
import type { SpawnDamageFn } from "@/utils/types/battle/spawnDamageFn";
import type { ProjectileHitDamageFn } from "@/utils/types/battle/projectileHit";
import { ProjectileHpConstants } from "@/data/projectile";
import { useProximityLoopSound } from "./useProximityLoopSound";
import { getTempo, NPC_TEMPO_ID, type TempoEffect } from "@/gameRules/battle/tempo";

type Props = {
  playerX: number;
  playerY: number;
  playerState: PlayerState;
  playerDirection: Direction;
  playerCharacter: string;
  npcClass: NPCClass;
  onProjectileHit: () => void;
  onMeleeHit: () => void;
  isPaused?: boolean;
  npcType: string;
  npcPhaseRef: React.RefObject<number>;
  onSummon?: (npcType: string) => void;
  onPullPlayer?: (x: number) => void;
  isAlfa?: boolean;
  onSummonFromRight?: (npcType: string) => void;
  onDragPlayer?: (npcX: number, npcY: number) => void;
  obstacles?: BattleObstacle[];
  tempoRef: React.RefObject<TempoEffect[]>;
  npcStaggerRef: React.RefObject<number>;
  rootedUntilRef?: React.RefObject<number>;
  honoredFleeRef?: React.RefObject<boolean>;
  npcHpRef?: React.RefObject<number>;
  npcMaxHpRef?: React.RefObject<number>;
  npcBlockedRef?: React.RefObject<boolean>;
  onGrabPlayer?: (flipped: boolean) => void;
  onThrowStart?: (npcX: number, npcDirection: "left" | "right") => void;
  onThrowPlayer?: (damageMultiplier: number) => void;
  onPushPlayer?: (npcX: number) => void;
  onRamPushPlayer?: (direction: "left" | "right", toX: number) => void;
  lastBlockPressRef?: React.RefObject<number>;
  lastAttackPressRef?: React.RefObject<number>;
  onGroundPaperHit?: () => void;
  onPaperExplode?: () => void;
  onArmorBuff?: (x: number, y: number) => void;
  onLaserHit?: () => void;
  onProjectileMiss?: (x: number) => void;
  onStuckPaperExplode?: () => void;
  onApplyDebuff?: (status: NewPlayerStatus) => void;
  /** Hit da burst do hungryKing (fase 2): 10% do dano base + push de 50px. */
  onBurstHit?: (pushDir: number) => void;
  /** Esfera do Riquelme no estado atual (para colisão com projéteis inimigos). */
  playerProjectileRef?: React.RefObject<PlayerSpecialProjectile | null>;
  /** Vida dos projéteis destrutíveis (1/3 do dano que causariam no jogador). */
  projectileHpRef?: React.RefObject<number>;
  /** Damage numbers do jogador acertando projéteis inimigos. */
  spawnDamageRef?: React.RefObject<SpawnDamageFn>;
  /** Token de 1 instância de dano por golpe — projéteis só levam 1 por ataque. */
  playerCooldownRef?: React.RefObject<boolean>;
  /** Dano real do golpe ativo (básico ou special) aplicado nos projéteis. */
  playerHitDamageRef?: React.RefObject<ProjectileHitDamageFn>;
  /** Timestamp até onde os projéteis ficam congelados (Killer Queen). */
};

export function useNpcAI({
  playerX,
  playerY,
  playerState,
  playerDirection,
  playerCharacter,
  npcClass,
  onMeleeHit,
  onProjectileHit,
  isPaused,
  npcType,
  npcPhaseRef,
  onSummon,
  onPullPlayer,
  isAlfa,
  onSummonFromRight,
  onDragPlayer,
  obstacles,
  tempoRef,
  npcStaggerRef,
  rootedUntilRef,
  honoredFleeRef,
  npcHpRef,
  npcMaxHpRef,
  npcBlockedRef,
  onGrabPlayer,
  onThrowStart,
  onThrowPlayer,
  onPushPlayer,
  onRamPushPlayer,
  lastBlockPressRef,
  lastAttackPressRef,
  onGroundPaperHit,
  onPaperExplode,
  onArmorBuff,
  onLaserHit,
  onProjectileMiss,
  onStuckPaperExplode,
  onApplyDebuff,
  onBurstHit,
  playerProjectileRef,
  projectileHpRef,
  spawnDamageRef,
  playerCooldownRef,
  playerHitDamageRef,
}: Props) {
  const [npc, setNpc] = useState<NPCBattleState>({
    x: BATTLE_SPAWN.npc.x,
    y: BATTLE_SPAWN.npc.y,
    state: "walk",
    direction: "left",
  });

  const npcRef = useLatestRef(npc);

  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [forceIdle, setForceIdle] = useState(false);

  const activeProjectile = projectiles[0] ?? null;
  const projectileRef = useLatestRef(activeProjectile);
  const setProjectile = useCallback(
    (p: Projectile | null) => {
      if (p == null) {
        setProjectiles([]);
        return;
      }
      const hp = projectileHpRef?.current ?? ProjectileHpConstants.DEFAULT_HP;
      setProjectiles((prev) => [...prev, { ...p, hp, maxHp: hp }]);
    },
    [projectileHpRef],
  );
  const playerXRef = useLatestRef(playerX);
  const playerYRef = useLatestRef(playerY);
  const playerStateRef = useLatestRef(playerState);
  const playerDirectionRef = useLatestRef(playerDirection);
  const forceIdleRef = useLatestRef(forceIdle);
  const isPausedRef = useLatestRef(isPaused);
  const npcTypeRef = useLatestRef(npcType);
  const onProjectileHitRef = useLatestRef(onProjectileHit);
  const onMeleeHitRef = useLatestRef(onMeleeHit);
  const onSummonRef = useLatestRef(onSummon);
  const onPullPlayerRef = useLatestRef(onPullPlayer);
  const isAlfaRef = useLatestRef(isAlfa);
  const onSummonFromRightRef = useLatestRef(onSummonFromRight);
  const onDragPlayerRef = useLatestRef(onDragPlayer);
  const lastAttackRef = useRef(0);
  const summonTimerRef = useRef(0);
  const obstaclesRef = useLatestRef(obstacles ?? []);

  const { playSound, stopSound } = useSoundEffects();
  const loggedPlaySound = useCallback(
    (sound: Parameters<typeof playSound>[0], loop?: boolean) => {
      logPlay(sound, loop);
      playSound(sound, loop);
    },
    [playSound],
  );
  const onGrabPlayerRef = useLatestRef(onGrabPlayer);
  const onThrowStartRef = useLatestRef(onThrowStart);
  const onThrowPlayerRef = useLatestRef(onThrowPlayer);
  const onPushPlayerRef = useLatestRef(onPushPlayer);
  const onRamPushPlayerRef = useLatestRef(onRamPushPlayer);

  const onProjectileDestroyed = useCallback(() => {
    playSound("smash");
    logPlay("smash");
  }, [playSound]);
  const onGroundPaperHitRef = useLatestRef(onGroundPaperHit);
  const onPaperExplodeRef = useLatestRef(onPaperExplode);
  const onArmorBuffRef = useLatestRef(onArmorBuff);
  const onLaserHitRef = useLatestRef(onLaserHit);
  const onProjectileMissRef = useLatestRef(onProjectileMiss);
  const onStuckPaperExplodeRef = useLatestRef(onStuckPaperExplode);
  const onApplyDebuffRef = useLatestRef(onApplyDebuff);
  const onBurstHitRef = useLatestRef(onBurstHit);

  const { update: updateProximitySound } = useProximityLoopSound(
    npcTypeRef,
    playerXRef,
    playerYRef,
    playSound,
    stopSound,
  );

  const { strikeProjectiles } = useProjectile(
    projectiles,
    setProjectiles,
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
    tempoRef,
    onPullPlayer,
    (x: number) => {
      const maugrelo = npcRef.current.ai?.maugrelo;
      if (!maugrelo) return;
      if (maugrelo.landedPapers.length >= 3) return;
      maugrelo.landedPapers.push({
        id: maugrelo.paperIdCounter++,
        x,
        y: 535,
        sprite: "paper",
        createdAt: Date.now(),
      });
      onProjectileMissRef.current?.(x);
    },
    () => {
      const maugrelo = npcRef.current.ai?.maugrelo;
      if (!maugrelo) return;
      if (maugrelo.stuckPapers.length >= 3) return;
      maugrelo.stuckPapers.push({
        id: maugrelo.paperIdCounter++,
        stuckAt: Date.now(),
      });
      playSound("paperPreExplode");
      logPlay("paperPreExplode");
    },
    playerCharacter,
    npcClass,
    (pushDir: number) => onBurstHitRef.current?.(pushDir),
    playerProjectileRef,
    onProjectileDestroyed,
    spawnDamageRef,
    playerCooldownRef,
    playerHitDamageRef,
  );

  const resetNpc = (stateOverride?: NPCBattleState["state"]) => {
    setNpc({
      x: BATTLE_SPAWN.npc.x,
      y: BATTLE_SPAWN.npc.y,
      state: stateOverride ?? "walk",
      direction: "left",
      hidden: false,
    });

    setProjectile(null);
    lastAttackRef.current = 0;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNpc((n) => {
        // Passiva "O Abençoado": inimigos próximos recuam até ficarem a
        // HONORED_ONE_FLEE_DISTANCE de distância em x (roda mesmo com o AI
        // pausado/hitstop, já que a batalha está congelada).
        if (honoredFleeRef?.current) {
          const distanceX = Math.abs(n.x - playerXRef.current);
          if (distanceX < HONORED_ONE_FLEE_DISTANCE) {
            const step = Math.min(
              HONORED_ONE_FLEE_DISTANCE - distanceX,
              HONORED_ONE_FLEE_STEP,
            );
            const awayDir = n.x >= playerXRef.current ? 1 : -1;
            const nextX = Math.max(
              BATTLE_LIMITS.minX,
              Math.min(BATTLE_LIMITS.maxX, n.x + awayDir * step),
            );
            const collision = applyObstacleCollision(
              nextX,
              n.y,
              obstaclesRef.current,
            );
            return {
              ...n,
              x: Math.max(
                BATTLE_LIMITS.minX,
                Math.min(BATTLE_LIMITS.maxX, collision.x),
              ),
              y: collision.y,
              direction: getNpcDirection(nextX, playerXRef.current),
              state: n.state === "block" ? "block" : "walk",
            };
          }
          return n;
        }

        if (isPausedRef.current) return n;
        const npcTempo = getTempo(tempoRef.current, "npc", NPC_TEMPO_ID);
        if (npcTempo.speed === 0) return n;

        if (npcBlockedRef?.current) {
          return {
            ...n,
            state: "block",
          };
        }

        if (npcStaggerRef.current > Date.now()) {
          return {
            ...n,
            direction: getNpcDirection(n.x, playerXRef.current),
          };
        }

        const attack = getNpcAttack(npcTypeRef.current);

        const targetX = playerXRef.current;
        const targetY = playerYRef.current;

        const result = attack.execute({
          npc: n,
          playerX: playerXRef.current,
          playerY: playerYRef.current,
          playerState: playerStateRef.current,
          playerDirection: playerDirectionRef.current,
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
          isAlfa: isAlfaRef.current,
          onSummonFromRight: (npcType) =>
            onSummonFromRightRef.current?.(npcType),
          onDragPlayer: (npcX, npcY) => onDragPlayerRef.current?.(npcX, npcY),
          summonTimerRef,
          playSound: loggedPlaySound,
          npcHp: npcHpRef?.current ?? 0,
          npcMaxHp: npcMaxHpRef?.current ?? 1,
          onGrabPlayer: (flipped) => onGrabPlayerRef.current?.(flipped),
          onThrowStart: (x, d) => onThrowStartRef.current?.(x, d),
          onThrowPlayer: (mult) => onThrowPlayerRef.current?.(mult),
          onPushPlayer: (x) => onPushPlayerRef.current?.(x),
          onRamPushPlayer: (direction, toX) =>
            onRamPushPlayerRef.current?.(direction, toX),
          isPlayerParrying: () =>
            isParryPress(lastBlockPressRef, lastAttackPressRef),
          onGroundPaperHit: onGroundPaperHitRef.current,
          onPaperExplode: onPaperExplodeRef.current,
          onArmorBuff: onArmorBuffRef.current,
          onLaserHit: onLaserHitRef.current,
          onStuckPaperExplode: onStuckPaperExplodeRef.current,
          onApplyDebuff: onApplyDebuffRef.current,
        });

        const rooted = (rootedUntilRef?.current ?? 0) > Date.now();
        // Regra de tempo: o `execute` de cada NPC devolve a posição final do
        // tick. Escalar o delta aqui (em vez de editar os 20 `chasePlayer`)
        // faz o slow-movement valer para todo comportamento — perseguir,
        // dash, investida — sem que cada um precise saber da regra.
        const scaledX =
          n.x + (result.x - n.x) * npcTempo.speed;
        const nextX = rooted ? n.x : scaledX;
        const nextY = result.y ?? n.y;
        const direction =
          result.direction ?? getNpcDirection(nextX, playerXRef.current);
        const distanceX = Math.abs(n.x - playerXRef.current);

        updateProximitySound(n.x, n.y);

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
          hidden: result.hidden ?? n.hidden,
          state: result.state ?? getNpcState(distanceX, forceIdleRef.current),
        };
      });
    }, 20);

    return () => {
      clearInterval(interval);
      stopSound("jhowsimarVemCa");
      logStop("jhowsimarVemCa");
    };
  }, [
    tempoRef,
    npcStaggerRef,
    rootedUntilRef,
    honoredFleeRef,
    npcPhaseRef,
    npcBlockedRef,
    npcHpRef,
    npcMaxHpRef,
    playSound,
    loggedPlaySound,
    stopSound,
    updateProximitySound,
    forceIdleRef,
    isPausedRef,
    npcTypeRef,
    obstaclesRef,
    onGrabPlayerRef,
    onMeleeHitRef,
    onProjectileHitRef,
    onPullPlayerRef,
    onSummonRef,
    isAlfaRef,
    onSummonFromRightRef,
    onDragPlayerRef,
    onThrowPlayerRef,
    onThrowStartRef,
    onPushPlayerRef,
    onRamPushPlayerRef,
    lastBlockPressRef,
    lastAttackPressRef,
    onGroundPaperHitRef,
    onPaperExplodeRef,
    onArmorBuffRef,
    onLaserHitRef,
    onStuckPaperExplodeRef,
    onApplyDebuffRef,
    playerXRef,
    playerYRef,
    playerStateRef,
    playerDirectionRef,
    projectileRef,
    setProjectile,
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

  const groundPapers = [
    ...(npc.ai?.maugrelo?.groundPapers ?? []),
    ...(npc.ai?.maugrelo?.landedPapers ?? []),
  ];
  const stuckPapers = npc.ai?.maugrelo?.stuckPapers ?? [];
  const flyingPaper = npc.ai?.maugrelo?.flyingPaper ?? null;
  const laser = npc.ai?.maugrelo?.laser ?? null;

  return {
    ...npc,
    projectile: activeProjectile,
    projectiles,
    groundPapers,
    stuckPapers,
    flyingPaper,
    laser,
    resetNpc,
    updateNpc,
    setNpc,
    setProjectiles,
    strikeProjectiles,
  };
}
