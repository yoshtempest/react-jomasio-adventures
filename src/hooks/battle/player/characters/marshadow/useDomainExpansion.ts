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
import { getProjectileCenter } from "@/gameRules/npc/projectileDamage";
import {
  applyTime,
  clearTime,
  freezeWorldSpec,
  type TimeEffect,
} from "@/gameRules/battle/time";
import {
  isPlayerFrozen,
  isPlayerParalyzed,
} from "@/gameRules/battle/status/statusEffects";
import { BATTLE_LIMITS } from "@/gameRules/movement/constants";
import type { SoundId } from "@/utils/audio/soundId";
import type { NPCBattleState, SummonedNpc } from "@/utils/types/npc/npc";

/** Cooldown da Expansão de Domínio (45s). */
export const DOMAIN_EXPANSION_COOLDOWN_MS = 45_000;
/** Id do efeito de time da Expansão de Domínio (regra `gameRules/battle/time`). */
export const DOMAIN_EXPANSION_TIME_ID = "marshadow:domainExpansion";
/** Fase preMugetsu (blink visual + teleporte para a ponta mais próxima): 600ms. */
export const DOMAIN_EXPANSION_PRE_MS = 600;
/** Fase mugetsu (sprite mugetsu.svg) antes da varredura: 700ms. */
export const DOMAIN_EXPANSION_MUGETSU_MS = 700;
/** Alguns dos 600ms de preMugetsu: some (preto veio do blink). */
export const DOMAIN_EXPANSION_BLINK_OUT_MS = 300;
/** Fade-in do sprite no local de chegada do teleporte. */
export const DOMAIN_EXPANSION_BLINK_IN_MS = 250;
/** Velocidade da varredura do mugetsuEffect (px lógicos por ms). */
export const DOMAIN_EXPANSION_SWEEP_SPEED = 0.8;
/** Duração da varredura de uma ponta à outra do mapa (950 - 80 = 870px). */
export const DOMAIN_EXPANSION_SWEEP_MS = Math.ceil(
  (BATTLE_LIMITS.maxX - BATTLE_LIMITS.minX) / DOMAIN_EXPANSION_SWEEP_SPEED,
);
/**
 * Duração da desintegração dos alvos tocados: o sprite é picotado em pixels
 * que escurecem com a passagem do mugetsuEffect e depois voam como pó.
 * A habilidade só encerra quando o pó do último alvo termina.
 */
export const DOMAIN_EXPANSION_DISINTEGRATION_MS = 3000;
/** Congelamento total das ações do jogador durante a habilidade. */
export const DOMAIN_EXPANSION_TOTAL_MS =
  DOMAIN_EXPANSION_PRE_MS +
  DOMAIN_EXPANSION_MUGETSU_MS +
  DOMAIN_EXPANSION_SWEEP_MS +
  250 +
  DOMAIN_EXPANSION_DISINTEGRATION_MS;

/** Estado da varredura do mugetsuEffect pela batalha. */
export type MugetsuSweep = {
  /** Frente da varredura (px lógicos) — define o dano e o foco da câmera. */
  x: number;
  /** Ponta de partida (posição do jogador após o teleporte). */
  fromX: number;
  /** Outra ponta do mapa — a varredura termina aqui. */
  toX: number;
  direction: "left" | "right";
  /** Referência vertical (pés do jogador no instante do disparo). */
  y: number;
};

/** Fase do blink visual do teleporte: "out" (some) → "in" (vem). */
export type MugetsuBlink = "out" | "in" | null;

/** Alvo sendo desintegrado pela varredura (sprite vira pixels pretos e pó). */
export type MugetsuDisintegrationTarget = {
  /** "main" para o NPC principal; summonId para os summons. */
  id: string;
  npcType: string;
  /** Estado do sprite no instante do toque (para resolver o sprite). */
  state: string;
  npcPhase: number;
  isAlfa: boolean;
  /** Centro do alvo (px lógicos) — a passagem da varredura usa esses eixos. */
  x: number;
  /** Pés do alvo (px lógicos). */
  y: number;
  /** Direção da varredura no toque (define o vento do pó). */
  direction: "left" | "right";
  startedAt: number;
};

type Props = {
  player: Player;
  setPlayer: Dispatch<SetStateAction<Player>>;
  /** NPC principal (x/y via latestRef; updateNpc aplica a pose de hit). */
  npc: {
    x: number;
    y: number;
    state: NPCBattleState["state"];
    updateNpc: (partial: Partial<NPCBattleState>) => void;
  };
  /** Dados do NPC principal para registrar a desintegração no toque. */
  mainNpcType: string;
  mainNpcPhase: number;
  isAlfa: boolean;
  /** Summons inimigos — todos os cruzados pela varredura morrem. */
  summons: SummonedNpc[];
  setSummons: Dispatch<SetStateAction<SummonedNpc[]>>;
  /** Projéteis inimigos — a varredura desintegra os que a frente alcança. */
  projectiles: Projectile[];
  setProjectiles: Dispatch<SetStateAction<Projectile[]>>;
  setNpcHP: Dispatch<SetStateAction<number>>;
  /** Vida máxima do NPC principal — o dano exibido é 100% dela. */
  npcMaxHp: number;
  giveSummonRewards: (npcClass: NPCClass) => void;
  spawnDamageNumber: (
    value: number,
    x: number,
    y: number,
    type: DamageType,
  ) => void;
  /** Registra dano causado (combo/energia amaldiçoada/passivas). */
  registerHitRef: RefObject<(damage: number) => void>;
  freezeActionsUntilRef: RefObject<number>;
  /** Efeitos de time da batalha (regra `gameRules/battle/time`). */
  timeRef: RefObject<TimeEffect[]>;
  isPausedRef: RefObject<boolean>;
  battleEndedRef: RefObject<boolean>;
  disabledRef: RefObject<boolean>;
  /** specialIntro: abre o background da habilidade (habilities/domainExpansion/...). */
  startSpecialIntro: (
    character: string,
    onActivate: () => void,
    ability?: string,
  ) => void;
  /** Disparado APENAS quando a varredura chega na outra ponta do mapa. */
  onNpcKilled: () => void;
  playSound: (sound: SoundId, loop?: boolean, volumeOverride?: number) => void;
};

type DomainExpansionApi = {
  /** Instância do mugetsuEffect varrendo o mapa (null quando inativa). */
  mugetsuSweep: MugetsuSweep | null;
  /** True do início da habilidade até o fim da varredura (troca o background). */
  domainExpansionActive: boolean;
  /** Fase do blink do teleporte do jogador. */
  mugetsuBlink: MugetsuBlink;
  /** Alvos (NPC principal + summons) sendo desintegrados em pó. */
  disintegrating: MugetsuDisintegrationTarget[];
  press: () => void;
  usable: boolean;
  /** Cooldown restante em segundos (0 quando pronto). */
  remaining: number;
};

/**
 * Expansão de Domínio do marcelo: o jogador troca para preMugetsu.svg, dá um
 * blink visual e se teletransporta para a ponta mais próxima do mapa; no pico
 * (mugetsu.svg) uma nova instância (mugetsuEffect.svg) cobre toda a altura do
 * mapa e varre de uma ponta à outra, matando instantaneamente (100% da vida
 * máxima) tudo que toca. A batalha só encerra quando a varredura chega na
 * outra ponta (via onNpcKilled) — por isso o isEnding é setado no spawn do
 * efeito, bloqueando o lifecycle enquanto ela percorre o mapa. Cooldown de 45s.
 */
export function useDomainExpansion({
  player,
  setPlayer,
  npc,
  mainNpcType,
  mainNpcPhase,
  isAlfa,
  summons,
  setSummons,
  projectiles,
  setProjectiles,
  setNpcHP,
  npcMaxHp,
  giveSummonRewards,
  spawnDamageNumber,
  registerHitRef,
  freezeActionsUntilRef,
  timeRef,
  isPausedRef,
  battleEndedRef,
  disabledRef,
  startSpecialIntro,
  onNpcKilled,
  playSound,
}: Props): DomainExpansionApi {
  const [mugetsuSweep, setMugetsuSweep] = useState<MugetsuSweep | null>(null);
  const [domainExpansionActive, setDomainExpansionActive] = useState(false);
  const [mugetsuBlink, setMugetsuBlink] = useState<MugetsuBlink>(null);
  const [disintegrating, setDisintegrating] = useState<
    MugetsuDisintegrationTarget[]
  >([]);
  const [remaining, setRemaining] = useState(0);

  const activeRef = useRef(false);
  const readyAtRef = useRef(0);
  const sweepStartRef = useRef(0);
  /** True quando a varredura chegou na outra ponta (resta só o pó voar). */
  const sweepEndedRef = useRef(false);
  /** Conta síncrona de alvos ainda desintegrando (independe do state commit). */
  const pendingDisintegrationsRef = useRef(0);
  const npcKilledRef = useRef(false);
  const killedSummonIdsRef = useRef(new Set<string>());
  const disintegratedProjectileIdsRef = useRef(new Set<string>());
  const completeFiredRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playerRef = useLatestRef(player);
  const npcRef = useLatestRef(npc);
  const summonsRef = useLatestRef(summons);
  const projectilesRef = useLatestRef(projectiles);
  const sweepRef = useLatestRef(mugetsuSweep);
  const npcMaxHpRef = useLatestRef(npcMaxHp);
  const onNpcKilledRef = useLatestRef(onNpcKilled);
  const mainNpcTypeRef = useLatestRef(mainNpcType);
  const mainNpcPhaseRef = useLatestRef(mainNpcPhase);
  const isAlfaRef = useLatestRef(isAlfa);

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

  const clearTimer = useCallback(() => {
    if (tickTimerRef.current != null) {
      clearInterval(tickTimerRef.current);
      tickTimerRef.current = null;
    }
  }, []);

  /**
   * Registra um alvo sendo desintegrado pela varredura. O recorde (e o pó)
   * persiste por `DOMAIN_EXPANSION_DISINTEGRATION_MS`; ao remover o último
   * alvo, o tick encerra a habilidade (só aí a vitória é disparada).
   */
  const registerDisintegration = useCallback(
    (target: MugetsuDisintegrationTarget) => {
      pendingDisintegrationsRef.current += 1;
      setDisintegrating((prev) =>
        prev.some((t) => t.id === target.id) ? prev : [...prev, target],
      );
      timersRef.current.push(
        setTimeout(() => {
          pendingDisintegrationsRef.current -= 1;
          setDisintegrating((prev) => prev.filter((t) => t.id !== target.id));
        }, DOMAIN_EXPANSION_DISINTEGRATION_MS),
      );
    },
    [],
  );

  /** Encerra a habilidade (fim da varredura + pó ou cancelamento) e restaura o idle. */
  const finish = useCallback(() => {
    activeRef.current = false;
    clearTimers();
    clearTimer();
    sweepStartRef.current = 0;
    sweepEndedRef.current = false;
    pendingDisintegrationsRef.current = 0;
    timeRef.current = clearTime(timeRef.current, DOMAIN_EXPANSION_TIME_ID);
    setMugetsuSweep(null);
    setMugetsuBlink(null);
    setDomainExpansionActive(false);
    setDisintegrating([]);
    setPlayer((p) =>
      p.mode !== "battle" ||
      (p.state !== "preMugetsu" && p.state !== "mugetsu")
        ? p
        : { ...p, state: "idle" },
    );
    if (npcKilledRef.current && !completeFiredRef.current) {
      completeFiredRef.current = true;
      onNpcKilledRef.current();
    }
  }, [clearTimers, clearTimer, onNpcKilledRef, setPlayer, timeRef]);

  const finishRef = useLatestRef(finish);

  const cleanup = useCallback(() => {
    finish();
  }, [finish]);

  const cleanupRef = useLatestRef(cleanup);

  /** Cruzou a frente da varredura em `frontX` (mata de 0 em `fromX` até lá). */
  const hasCrossed = useCallback(
    (targetX: number, sweep: MugetsuSweep, frontX: number) => {
      if (sweep.direction === "right") {
        return targetX >= sweep.fromX && targetX <= frontX;
      }
      return targetX <= sweep.fromX && targetX >= frontX;
    },
    [],
  );

  /** Mata instantaneamente (100% da vida máxima) tudo que a varredura cruzou. */
  const applyKillAt = useCallback(
    (frontX: number) => {
      const sweep = sweepRef.current;
      if (!sweep) return;

      // NPC principal: HP → 0 no toque, mas a vitória só vem no fim da
      // varredura + desintegração. O sprite-base some (hidden) e o canvas de
      // desintegração assume o visual a partir de agora.
      const main = npcRef.current;
      if (!npcKilledRef.current && hasCrossed(main.x, sweep, frontX)) {
        npcKilledRef.current = true;
        const damage = npcMaxHpRef.current;
        setNpcHP(0);
        spawnDamageNumber(damage, main.x, main.y, "special");
        registerHitRef.current?.(damage);
        registerDisintegration({
          id: "main",
          npcType: mainNpcTypeRef.current,
          state: main.state,
          npcPhase: mainNpcPhaseRef.current,
          isAlfa: isAlfaRef.current,
          x: main.x,
          y: main.y,
          direction: sweep.direction,
          startedAt: Date.now(),
        });
        main.updateNpc({ state: "hit", hidden: true });
      }

      // Summons inimigos: removidos (com recompensa rare) no toque — o visual
      // da morte passa a ser a desintegração (recorde no momento do corte).
      const killedIds = killedSummonIdsRef.current;
      let changed = false;
      let killed = false;
      const nextSummons = summonsRef.current.map((s) => {
        if (s.isDying || killedIds.has(s.id)) return s;
        if (!hasCrossed(s.x, sweep, frontX)) return s;
        killedIds.add(s.id);
        changed = true;
        killed = true;
        spawnDamageNumber(s.maxHp, s.x, s.y, "summon");
        registerHitRef.current?.(s.maxHp);
        registerDisintegration({
          id: s.id,
          npcType: s.npcType,
          state: s.state,
          npcPhase: 1,
          isAlfa: false,
          x: s.x,
          y: s.y,
          direction: sweep.direction,
          startedAt: Date.now(),
        });
        return null;
      });
      if (changed) {
        setSummons(nextSummons.filter((s): s is SummonedNpc => s != null));
      }
      if (killed) {
        giveSummonRewards("rare");
      }

      // Projéteis inimigos: a varredura desintegra o que a frente alcança (mesmo
      // critério X-only do NPC). O número de dano mostra o HP integral do
      // projétil, como no NPC/summon; `registerHit` fica de fora para o combo não
      // contar a destruction de um prato como dano do jogador.
      const disintegrated = disintegratedProjectileIdsRef.current;
      const crossedProjectiles = projectilesRef.current.filter(
        (p) => !disintegrated.has(p.id) && hasCrossed(p.x, sweep, frontX),
      );
      if (crossedProjectiles.length > 0) {
        const ids = new Set(crossedProjectiles.map((p) => p.id));
        for (const id of ids) disintegrated.add(id);
        setProjectiles((prev) => prev.filter((p) => !ids.has(p.id)));
        for (const p of crossedProjectiles) {
          const point = getProjectileCenter(p);
          spawnDamageNumber(p.hp, point.x, point.y, "special");
        }
      }
    },
    [
      giveSummonRewards,
      hasCrossed,
      isAlfaRef,
      mainNpcPhaseRef,
      mainNpcTypeRef,
      npcMaxHpRef,
      npcRef,
      projectilesRef,
      registerDisintegration,
      registerHitRef,
      setNpcHP,
      setProjectiles,
      setSummons,
      spawnDamageNumber,
      summonsRef,
      sweepRef,
    ],
  );

  const applyKillAtRef = useLatestRef(applyKillAt);

  const tickRef = useLatestRef(
    useCallback(() => {
      // Varredura já chegou na outra ponta: falta só o pó dos alvos voar.
      if (sweepEndedRef.current) {
        if (pendingDisintegrationsRef.current === 0) {
          finishRef.current();
        }
        return;
      }

      const sweep = sweepRef.current;
      if (!sweep) return;

      const elapsed = Date.now() - sweepStartRef.current;
      const direction = sweep.direction === "right" ? 1 : -1;
      const frontX = Math.max(
        Math.min(
          sweep.fromX +
            direction * DOMAIN_EXPANSION_SWEEP_SPEED * elapsed,
          Math.max(sweep.fromX, sweep.toX),
        ),
        Math.min(sweep.fromX, sweep.toX),
      );

      applyKillAtRef.current(frontX);

      const reachedEnd =
        (sweep.direction === "right" && frontX >= sweep.toX) ||
        (sweep.direction === "left" && frontX <= sweep.toX);

      if (reachedEnd) {
        sweepEndedRef.current = true;
        // Some o efeito visual da varredura; o mundo segue coberto pelo
        // overlay da expansão até a última desintegração acabar.
        setMugetsuSweep(null);
        if (pendingDisintegrationsRef.current === 0) {
          finishRef.current();
        }
        return;
      }

      setMugetsuSweep((prev) =>
        prev ? { ...prev, x: frontX } : prev,
      );
    }, [
      applyKillAtRef,
      finishRef,
      sweepRef,
    ]),
  );

  const press = useCallback(() => {
    if (activeRef.current) return;
    if (!usableRef.current) return;

    activeRef.current = true;
    readyAtRef.current = Date.now() + DOMAIN_EXPANSION_COOLDOWN_MS;
    setRemaining(DOMAIN_EXPANSION_COOLDOWN_MS / 1000);
    // Regra de time: a Expansão de Domínio para o mundo inteiro. O player fica
    // de fora do `TimeKind` — o lock de ação dele é o `freezeActionsUntilRef`.
    timeRef.current = applyTime(
      timeRef.current,
      freezeWorldSpec(DOMAIN_EXPANSION_TIME_ID, DOMAIN_EXPANSION_TOTAL_MS),
    );
    freezeActionsUntilRef.current = Math.max(
      freezeActionsUntilRef.current,
      Date.now() + DOMAIN_EXPANSION_TOTAL_MS,
    );
    clearTimers();
    setMugetsuSweep(null);
    setMugetsuBlink(null);
    setDomainExpansionActive(true);
    setDisintegrating([]);
    npcKilledRef.current = false;
    killedSummonIdsRef.current.clear();
    disintegratedProjectileIdsRef.current.clear();
    completeFiredRef.current = false;
    sweepEndedRef.current = false;
    pendingDisintegrationsRef.current = 0;

    // Teleporte para a ponta mais próxima: a varredura percorre o mapa inteiro.
    const p = playerRef.current;
    const midX = (BATTLE_LIMITS.minX + BATTLE_LIMITS.maxX) / 2;
    const fromX = p.x < midX ? BATTLE_LIMITS.minX : BATTLE_LIMITS.maxX;
    const toX =
      fromX === BATTLE_LIMITS.minX ? BATTLE_LIMITS.maxX : BATTLE_LIMITS.minX;
    const sweepDirection: "left" | "right" =
      fromX === BATTLE_LIMITS.minX ? "right" : "left";

    startSpecialIntro("marcelo", () => {}, "domainExpansion");

    const mugetsuAt = DOMAIN_EXPANSION_PRE_MS;
    const sweepAt = mugetsuAt + DOMAIN_EXPANSION_MUGETSU_MS;

    timersRef.current = [
      // Turn 1 do jogador para preMugetsu.svg + blink de saída (teleporte logo em seguida).
      setTimeout(() => {
        if (shouldCancelRef.current()) {
          cleanupRef.current();
          return;
        }
        setPlayer((pp) =>
          pp.mode !== "battle" ? pp : { ...pp, state: "preMugetsu" },
        );
        setMugetsuBlink("out");
        playSound("preMarshadowSpecial");
      }, 0),

      // Teleporte para a ponta mais próxima no meio do blink + blink de chegada.
      setTimeout(() => {
        if (shouldCancelRef.current()) {
          cleanupRef.current();
          return;
        }
        setPlayer((pp) =>
          pp.mode !== "battle"
            ? pp
            : {
                ...pp,
                x: fromX,
                battleDirection: sweepDirection,
              },
        );
        setMugetsuBlink("in");
      }, DOMAIN_EXPANSION_BLINK_OUT_MS),

      setTimeout(() => {
        if (shouldCancelRef.current()) {
          cleanupRef.current();
          return;
        }
        setMugetsuBlink(null);
      }, DOMAIN_EXPANSION_BLINK_OUT_MS + DOMAIN_EXPANSION_BLINK_IN_MS),

      // Pico: sprite mugetsu.svg + som dedicado.
      setTimeout(() => {
        if (shouldCancelRef.current()) {
          cleanupRef.current();
          return;
        }
        setPlayer((pp) =>
          pp.mode !== "battle" ? pp : { ...pp, state: "mugetsu" },
        );
        playSound("mugetsu");
      }, mugetsuAt),

      // Criação do mugetsuEffect: a partir daqui a câmera segue a varredura,
      // o jogador volta ao preMugetsu.svg e o isEnding bloqueia o lifecycle.
      setTimeout(() => {
        if (shouldCancelRef.current()) {
          cleanupRef.current();
          return;
        }
        battleEndedRef.current = true;
        setPlayer((pp) =>
          pp.mode !== "battle" ? pp : { ...pp, state: "preMugetsu" },
        );
        setMugetsuSweep({
          x: fromX,
          fromX,
          toX,
          direction: sweepDirection,
          y: p.y,
        });
        sweepStartRef.current = Date.now();
        playSound("chargeAttack");
        clearTimer();
        tickTimerRef.current = setInterval(tickRef.current, 16);
      }, sweepAt),

      setTimeout(() => cleanupRef.current(), DOMAIN_EXPANSION_TOTAL_MS),
    ];
  }, [
    battleEndedRef,
    clearTimer,
    cleanupRef,
    clearTimers,
    freezeActionsUntilRef,
    playSound,
    playerRef,
    setPlayer,
    shouldCancelRef,
    startSpecialIntro,
    timeRef,
    tickRef,
    usableRef,
  ]);

  // Tick do cooldown restante do botão (45s).
  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, (readyAtRef.current - Date.now()) / 1000));
    }, 200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      clearTimer();
      activeRef.current = false;
    };
  }, [clearTimer, clearTimers]);

  return {
    mugetsuSweep,
    domainExpansionActive,
    mugetsuBlink,
    disintegrating,
    press,
    usable,
    remaining,
  };
}