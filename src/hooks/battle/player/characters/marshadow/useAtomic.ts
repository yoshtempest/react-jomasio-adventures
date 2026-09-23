import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import {
  ONE_HUNDRED_MS,
  TWO_HUNDRED_MS,
  FOUR_HUNDRED_FIFTY_MS,
  ONE_THOUSAND_MS,
} from "@/data/ms";
import {
  isPlayerFrozen,
  isPlayerParalyzed,
} from "@/gameRules/battle/status/statusEffects";
import type { SoundId } from "@/utils/audio/soundId";
import type { SummonedNpc } from "@/utils/types/npc/npc";

/** Cooldown da habilidade "I Am Atomic" (20s). */
export const ATOMIC_COOLDOWN_MS = 20_000;
/** Raio da explosão (px lógicos) a partir do inimigo com maior vida máxima. */
export const ATOMIC_RADIUS = 300;
/** Fase "starting" (sprite starting.svg via preAtomic): 100ms. */
export const ATOMIC_STARTING_MS = ONE_HUNDRED_MS;
/** Fase "preparing" (sprite preparing.svg + halo): 450ms. */
export const ATOMIC_PREPARING_MS = FOUR_HUNDRED_FIFTY_MS;
/** Tempo após o finalizating.svg até a explosion.svg explodir: 100ms. */
export const ATOMIC_EXPLOSION_DELAY_MS = ONE_HUNDRED_MS;
/** Duração do CutInEnemie sobre os inimigos atingidos. */
export const ATOMIC_CUT_DURATION_MS = TWO_HUNDRED_MS;
/** Animação total (1s) — casa com a duração do specialIntro (1s). */
export const ATOMIC_TOTAL_DURATION_MS = ONE_THOUSAND_MS;
/** Multiplicador do dano especial no alvo (inimigo com maior vida máxima). */
export const ATOMIC_TARGET_MULTIPLIER = 2;
/** Multiplicador do dano especial nos demais inimigos dentro do raio. */
export const ATOMIC_AREA_MULTIPLIER = 1;

/** Explosão da explosão atômica centrada no alvo (inimigo de maior vida máxima). */
export type AtomicExplosion = {
  x: number;
  y: number;
  npcType: string;
  phase: "starting" | "explosion";
};

/** CutInEnemie sobre um inimigo atingido dentro do raio. */
export type AtomicCut = {
  /** Contador de ativações — vira a chave React para reiniciar o sprite. */
  key: number;
  x: number;
  y: number;
  npcType: string;
  /** Ângulo aleatório (0 a 90 graus) do strike sobre o inimigo. */
  rotation: number;
};

/** Inimigos atingidos pelo dano (aplicado no useBattleCombat). */
export type AtomicBoomPayload = {
  /** id do alvo ("main" ou summon): recebe dano em dobro. */
  targetId: string;
  targetX: number;
  targetY: number;
  /** NPC principal atingido (sofre dano + CutInEnemie com chance de sangrar). */
  hitMain: boolean;
  hitSummonIds: string[];
};

type Props = {
  player: Player;
  setPlayer: Dispatch<SetStateAction<Player>>;
  /** NPC principal (x/y lidos via latestRef para o raio/alvo). */
  npc: { x: number; y: number };
  npcType: string;
  npcMaxHp: number;
  npcHp: number;
  /** Summons inimigos (x/y e vida máxima usados para alvo e raio). */
  summons: SummonedNpc[];
  /** specialIntro: abre o background da habilidade (habilities/atomic/...). */
  startSpecialIntro: (
    character: string,
    onActivate: () => void,
    ability?: string,
  ) => void;
  /** Aplica o dano em todos os inimigos atingidos (implementado no useBattleCombat). */
  onBoom: (payload: AtomicBoomPayload) => void;
  /** CutInEnemie do marcelo sobre o NPC principal (chance de sangrar). */
  onNpcCutInRef: RefObject<() => void>;
  freezeActionsUntilRef: RefObject<number>;
  isPausedRef: RefObject<boolean>;
  battleEndedRef: RefObject<boolean>;
  disabledRef: RefObject<boolean>;
  playSound: (sound: SoundId, loop?: boolean, volumeOverride?: number) => void;
};

type AtomicApi = {
  /** Halo acima do jogador durante preparing e finalizating. */
  halo: boolean;
  /** Explosão centrada no alvo (startingExplosion.svg → explosion.svg). */
  explosion: AtomicExplosion | null;
  /** CutInEnemie sobre cada inimigo atingido dentro do raio. */
  cuts: AtomicCut[];
  /** Flash no sprite do jogador quando a explosion.svg aparece. */
  flash: boolean;
  press: () => void;
  usable: boolean;
  /** Cooldown restante em segundos (0 quando pronto). */
  remaining: number;
};

/**
 * "I Am Atomic" do marcelo: o jogador dispara a sequência starting.svg →
 * preparing.svg → finalizating.svg (todas sob o background do specialIntro e
 * com o halo acima do sprite), centra a explosion.svg no inimigo com maior
 * vida máxima e, 100ms depois da troca para finalizating.svg, causa dano em
 * TODOS os inimigos em um raio de 300px (2x no alvo, 1x nos demais) junto com
 * um CutInEnemie (chance de sangrar no NPC principal). Cooldown de 20s.
 */
export function useAtomic({
  player,
  setPlayer,
  npc,
  npcType,
  npcMaxHp,
  npcHp,
  summons,
  startSpecialIntro,
  onBoom,
  onNpcCutInRef,
  freezeActionsUntilRef,
  isPausedRef,
  battleEndedRef,
  disabledRef,
  playSound,
}: Props): AtomicApi {
  const [halo, setHalo] = useState(false);
  const [explosion, setExplosion] = useState<AtomicExplosion | null>(null);
  const [cuts, setCuts] = useState<AtomicCut[]>([]);
  const [flash, setFlash] = useState(false);
  const [remaining, setRemaining] = useState(0);

  const activeRef = useRef(false);
  const readyAtRef = useRef(0);
  const cutKeyRef = useRef(0);
  const targetRef = useRef<
    { id: string; x: number; y: number; npcType: string } | null
  >(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const npcRef = useLatestRef(npc);
  const npcTypeRef = useLatestRef(npcType);
  const npcMaxHpRef = useLatestRef(npcMaxHp);
  const npcHpRef = useLatestRef(npcHp);
  const summonsRef = useLatestRef(summons);
  const onBoomRef = useLatestRef(onBoom);

  const canUse =
    player.character === "marcelo" &&
    player.mode === "battle" &&
    player.state === "idle" &&
    Math.abs(player.y - player.groundY) < 1 &&
    !isPlayerFrozen(player) &&
    !isPlayerParalyzed(player) &&
    freezeActionsUntilRef.current <= Date.now() &&
    readyAtRef.current <= Date.now() &&
    !activeRef.current;

  const usable =
    canUse &&
    !disabledRef.current &&
    !isPausedRef.current &&
    !battleEndedRef.current;
  const usableRef = useLatestRef(usable);

  const shouldCancelRef = useLatestRef(
    () =>
      disabledRef.current ||
      isPausedRef.current ||
      battleEndedRef.current ||
      !activeRef.current,
  );

  const clearTimers = useCallback(() => {
    for (const timer of timersRef.current) clearTimeout(timer);
    timersRef.current = [];
  }, []);

  const cleanup = useCallback(() => {
    activeRef.current = false;
    clearTimers();
    setHalo(false);
    setExplosion(null);
    setFlash(false);
    setCuts([]);
    targetRef.current = null;
    setPlayer((p) =>
      p.mode !== "battle" ||
      (p.state !== "preparingAtomic" && p.state !== "finalizatingAtomic")
        ? p
        : { ...p, state: "idle" },
    );
  }, [clearTimers, setPlayer]);

  const cleanupRef = useLatestRef(cleanup);

  /** Inimigo com a maior vida máxima — o alvo da explosão (2x de dano). */
  const findTarget = useCallback(() => {
    const enemies: {
      id: string;
      maxHp: number;
      x: number;
      y: number;
      npcType: string;
    }[] = [
      {
        id: "main",
        maxHp: npcMaxHpRef.current,
        x: npcRef.current.x,
        y: npcRef.current.y,
        npcType: npcTypeRef.current,
      },
      ...summonsRef.current.map((s) => ({
        id: s.id,
        maxHp: s.maxHp,
        x: s.x,
        y: s.y,
        npcType: s.npcType,
      })),
    ];
    let target = enemies[0] ?? {
      id: "main",
      maxHp: 0,
      x: npcRef.current.x,
      y: npcRef.current.y,
      npcType: npcTypeRef.current,
    };
    for (const enemy of enemies) {
      if (enemy.maxHp > target.maxHp) target = enemy;
    }
    return target;
  }, [npcTypeRef, npcRef, npcMaxHpRef, summonsRef]);

  const press = useCallback(() => {
    if (!usableRef.current) return;
    if (activeRef.current) return;

    activeRef.current = true;
    readyAtRef.current = Date.now() + ATOMIC_COOLDOWN_MS;
    setRemaining(ATOMIC_COOLDOWN_MS / 1000);
    freezeActionsUntilRef.current = Math.max(
      freezeActionsUntilRef.current,
      Date.now() + ATOMIC_TOTAL_DURATION_MS,
    );
    setHalo(false);
    setExplosion(null);
    setFlash(false);
    setCuts([]);
    cutKeyRef.current = 0;
    targetRef.current = null;
    clearTimers();

    // O specialIntro (1s) exibe o background da habilidade por cima de tudo e
    // deixa o tempo em slow-motion; a coreografia roda em paralelo cobrindo o
    // mesmo 1s (starting → preparing → finalizating → explosion).
    startSpecialIntro("marcelo", () => {}, "atomic");

    const prepareAt = ATOMIC_STARTING_MS;
    const finalizeAt = ATOMIC_STARTING_MS + ATOMIC_PREPARING_MS;
    const explodeAt = finalizeAt + ATOMIC_EXPLOSION_DELAY_MS;

    timersRef.current = [];

    timersRef.current.push(
      setTimeout(() => {
        if (shouldCancelRef.current()) {
          cleanupRef.current();
          return;
        }
        setPlayer((pp) =>
          pp.mode !== "battle" ? pp : { ...pp, state: "preparingAtomic" },
        );
        setHalo(true);
        playSound("preMarshadowSpecial");
      }, prepareAt),

      setTimeout(() => {
        if (shouldCancelRef.current()) {
          cleanupRef.current();
          return;
        }
        setPlayer((pp) =>
          pp.mode !== "battle" ? pp : { ...pp, state: "finalizatingAtomic" },
        );
        const target = findTarget();
        targetRef.current = target;
        setExplosion({
          x: target.x,
          y: target.y,
          npcType: target.npcType,
          phase: "starting",
        });
      }, finalizeAt),

      setTimeout(() => {
        if (shouldCancelRef.current()) {
          cleanupRef.current();
          return;
        }
        const target = targetRef.current ?? findTarget();

        setExplosion((prev) =>
          prev ? { ...prev, phase: "explosion" } : prev,
        );
        setFlash(true);
        playSound("marshadowSpecial");

        // Inimigos atingidos: todos em um raio de 300px (eixos x/y) do alvo.
        const hitSummonIds: string[] = [];
        const hitMain =
          Math.abs(npcRef.current.x - target.x) <= ATOMIC_RADIUS &&
          Math.abs(npcRef.current.y - target.y) <= ATOMIC_RADIUS;

        for (const s of summonsRef.current) {
          if (
            Math.abs(s.x - target.x) > ATOMIC_RADIUS ||
            Math.abs(s.y - target.y) > ATOMIC_RADIUS
          ) {
            continue;
          }
          hitSummonIds.push(s.id);
          if (s.isDying || s.hp <= 0) continue;
          cutKeyRef.current += 1;
          const cutKey = cutKeyRef.current;
          setCuts((prev) => [
            ...prev,
            {
              key: cutKey,
              x: s.x,
              y: s.y,
              npcType: s.npcType,
              rotation: Math.random() * 90,
            },
          ]);
          timersRef.current.push(
            setTimeout(
              () =>
                setCuts((prev) => prev.filter((c) => c.key !== cutKey)),
              ATOMIC_CUT_DURATION_MS,
            ),
          );
        }

        // NPC principal atingido: dano (via onBoom) + CutInEnemie com
        // chance de sangrar (mecânica padrão de ataque do marcelo).
        if (hitMain && npcHpRef.current > 0) {
          onNpcCutInRef.current?.();
        }

        onBoomRef.current({
          targetId: target.id,
          targetX: target.x,
          targetY: target.y,
          hitMain,
          hitSummonIds,
        });
      }, explodeAt),

      setTimeout(() => cleanupRef.current(), ATOMIC_TOTAL_DURATION_MS),
    );
  }, [
    cleanupRef,
    clearTimers,
    findTarget,
    freezeActionsUntilRef,
    npcHpRef,
    npcRef,
    onNpcCutInRef,
    onBoomRef,
    playSound,
    setPlayer,
    shouldCancelRef,
    startSpecialIntro,
    summonsRef,
    usableRef,
  ]);

  // Tick do cooldown restante do botão (20s).
  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, (readyAtRef.current - Date.now()) / 1000));
    }, 200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      activeRef.current = false;
    };
  }, [clearTimers]);

  return {
    halo,
    explosion,
    cuts,
    flash,
    press,
    usable,
    remaining,
  };
}