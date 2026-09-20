import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import {
  isPlayerFrozen,
  isPlayerParalyzed,
} from "@/gameRules/battle/status/statusEffects";
import { BATTLE_LIMITS } from "@/gameRules/movement/constants";
import { THREE_THOUSAND_MS } from "@/data/ms";
import { combatService } from "@/services/combat";
import type { SoundId } from "@/utils/audio/soundId";
import type { NPCBattleState, SummonedNpc } from "@/utils/types/npc/npc";

/** Duração total do feixe (3s) — o marcelo fica travado no sprite laser.svg. */
export const VASTOLORD_LASER_DURATION_MS = THREE_THOUSAND_MS;
/** Intervalo de dano/empurrão: 1% do dano base a cada 20ms de contato. */
export const VASTOLORD_LASER_TICK_MS = 1;
/** Fração do dano base aplicada por tick (1%). */
export const VASTOLORD_LASER_DAMAGE_RATIO = 0.01;
/** Distância (px no plano lógico) que o feixe empurra o inimigo por tick. */
export const VASTOLORD_LASER_PUSH_PX = 10;
/** Distância do topo do feixe até a base do jogador (player.y). */
export const VASTOLORD_LASER_TOP_GAP = 200;
/** Folga abaixo de player.y ainda considerada dentro do feixe. */
export const VASTOLORD_LASER_BOTTOM_SLACK = 20;
/** Altura do sprite vastolordLaser.svg (1000x243) em px lógicos. */
export const VASTOLORD_LASER_BEAM_HEIGHT = 243;

/** Feixe ativo do Laser da Forma Vastolord. */
export type VastolordLaserBeam = {
  fromX: number;
  toX: number;
  /** y do jogador no instante do disparo (base do feixe). */
  y: number;
};

type Props = {
  player: Player;
  setPlayer: Dispatch<SetStateAction<Player>>;
  /** Forma Vastolord ativa (o botão só aparece/liga dentro dela). */
  vastolordActive: boolean;
  /** Personagem do jogador (stats usadas para o dano base do feixe). */
  char: { stats: { strength: number } };
  playerClass: PlayerClass;
  /** NPC principal (x/y lidos via latestRef; updateNpc aplica o empurrão). */
  npc: {
    x: number;
    y: number;
    updateNpc: (partial: Partial<NPCBattleState>) => void;
  };
  /** Summons inimigos (também sofrem dano e empurrão do feixe). */
  summons: SummonedNpc[];
  setSummons: Dispatch<SetStateAction<SummonedNpc[]>>;
  setNpcHP: Dispatch<SetStateAction<number>>;
  giveSummonRewards: (npcClass: NPCClass) => void;
  spawnDamageNumber: (
    value: number,
    x: number,
    y: number,
    type: DamageType,
  ) => void;
  freezeActionsUntilRef: RefObject<number>;
  isPausedRef: RefObject<boolean>;
  battleEndedRef: RefObject<boolean>;
  disabledRef: RefObject<boolean>;
  playSound: (sound: SoundId, loop?: boolean, volumeOverride?: number) => void;
};

type VastolordLaserApi = {
  beam: VastolordLaserBeam | null;
  press: () => void;
  usable: boolean;
};

/**
 * Laser da Forma Vastolord do marcelo (uma vez por forma): o personagem troca
 * para o sprite `laser.svg` e um feixe (`vastolordLaser.svg`) cruza o mapa de
 * uma ponta à outra por 3s. A cada 20ms, todo inimigo na faixa do feixe sofre
 * 1% do dano base do personagem e é empurrado 10px para longe do jogador
 * (parando nas bordas via BATTLE_LIMITS). O jogador fica travado no disparo
 * durante os 3s; a habilidade só pode ser usada UMA vez por forma.
 */
export function useVastolordLaser({
  player,
  setPlayer,
  vastolordActive,
  char,
  playerClass,
  npc,
  summons,
  setSummons,
  setNpcHP,
  giveSummonRewards,
  spawnDamageNumber,
  freezeActionsUntilRef,
  isPausedRef,
  battleEndedRef,
  disabledRef,
  playSound,
}: Props): VastolordLaserApi {
  const [beam, setBeam] = useState<VastolordLaserBeam | null>(null);

  const activeRef = useRef(false);
  /** Uso único por forma — resetado quando vastolordActive sai. */
  const laserUsedRef = useRef(false);
  const shotStartRef = useRef(0);
  const accRef = useRef(0);
  const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playerRef = useLatestRef(player);
  const npcRef = useLatestRef(npc);
  const summonsRef = useLatestRef(summons);
  const beamRef = useLatestRef(beam);
  const vastolordActiveRef = useLatestRef(vastolordActive);

  const baseDamage = useMemo(
    () => combatService.calculatePlayerDamage(char.stats.strength, playerClass),
    [char.stats.strength, playerClass],
  );
  const baseDamageRef = useLatestRef(baseDamage);

  const canUse =
    player.character === "marcelo" &&
    player.mode === "battle" &&
    player.state === "idle" &&
    Math.abs(player.y - player.groundY) < 1 &&
    vastolordActive &&
    !laserUsedRef.current &&
    !isPlayerFrozen(player) &&
    !isPlayerParalyzed(player) &&
    freezeActionsUntilRef.current <= Date.now();

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
      !vastolordActiveRef.current,
  );

  const clearTimer = useCallback(() => {
    if (tickTimerRef.current != null) {
      clearInterval(tickTimerRef.current);
      tickTimerRef.current = null;
    }
  }, []);

  /** Encerra o feixe (fim dos 3s ou cancelamento) e restaura o idle. */
  const finish = useCallback(() => {
    activeRef.current = false;
    clearTimer();
    accRef.current = 0;
    shotStartRef.current = 0;
    setBeam(null);
    setPlayer((p) =>
      p.mode !== "battle" || p.state !== "laser" ? p : { ...p, state: "idle" },
    );
  }, [clearTimer, setPlayer]);

  const finishRef = useLatestRef(finish);

  const clampX = useCallback(
    (x: number) =>
      Math.max(BATTLE_LIMITS.minX, Math.min(BATTLE_LIMITS.maxX, x)),
    [],
  );

  const tickRef = useLatestRef(
    useCallback(() => {
      if (shouldCancelRef.current()) {
        finishRef.current();
        return;
      }
      if (Date.now() - shotStartRef.current >= VASTOLORD_LASER_DURATION_MS) {
        finishRef.current();
        return;
      }

      // Dano fracionado (1% do dano base por tick) acumulado até virar inteiro.
      accRef.current += baseDamageRef.current * VASTOLORD_LASER_DAMAGE_RATIO;
      const applied = Math.floor(accRef.current);
      if (applied < 1) return;
      accRef.current -= applied;

      const beamY = beamRef.current?.y;
      if (beamY == null) return;
      const top = beamY - VASTOLORD_LASER_TOP_GAP;
      const bottom = beamY + VASTOLORD_LASER_BOTTOM_SLACK;

      // NPC principal: dano + empurrão para longe do jogador (clampado).
      const mainNpc = npcRef.current;
      if (mainNpc.y >= top && mainNpc.y <= bottom) {
        setNpcHP((hp) => Math.max(0, hp - applied));
        spawnDamageNumber(applied, mainNpc.x, mainNpc.y, "npc");
        const dir = mainNpc.x >= playerRef.current.x ? 1 : -1;
        mainNpc.updateNpc({
          x: clampX(mainNpc.x + dir * VASTOLORD_LASER_PUSH_PX),
        });
      }

      // Summons inimigos: mesmo dano/empurrão; kill vira recompensa rare.
      let changed = false;
      let killed = false;
      const nextSummons = summonsRef.current.map((s) => {
        if (s.isDying || s.y < top || s.y > bottom) return s;
        changed = true;
        const newHp = Math.max(0, s.hp - applied);
        spawnDamageNumber(applied, s.x, s.y, "summon");
        if (newHp <= 0) {
          killed = true;
          return null;
        }
        const dir = s.x >= playerRef.current.x ? 1 : -1;
        return {
          ...s,
          hp: newHp,
          x: clampX(s.x + dir * VASTOLORD_LASER_PUSH_PX),
        };
      });
      if (changed) {
        setSummons(nextSummons.filter((s): s is SummonedNpc => s != null));
      }
      if (killed) {
        giveSummonRewards("rare");
      }
    }, [
      baseDamageRef,
      beamRef,
      clampX,
      finishRef,
      giveSummonRewards,
      npcRef,
      playerRef,
      setNpcHP,
      setSummons,
      shouldCancelRef,
      spawnDamageNumber,
      summonsRef,
    ]),
  );

  const press = useCallback(() => {
    if (activeRef.current) return;
    if (!usableRef.current) return;

    activeRef.current = true;
    laserUsedRef.current = true;
    accRef.current = 0;
    const p = playerRef.current;
    shotStartRef.current = Date.now();
    freezeActionsUntilRef.current = Math.max(
      freezeActionsUntilRef.current,
      Date.now() + VASTOLORD_LASER_DURATION_MS,
    );
    setBeam({
      fromX: BATTLE_LIMITS.minX,
      toX: BATTLE_LIMITS.maxX,
      y: p.y,
    });
    setPlayer((pp) =>
      pp.mode !== "battle" ? pp : { ...pp, state: "laser" },
    );
    playSound("laser");

    clearTimer();
    tickTimerRef.current = setInterval(
      tickRef.current,
      VASTOLORD_LASER_TICK_MS,
    );
  }, [
    clearTimer,
    freezeActionsUntilRef,
    playSound,
    playerRef,
    setPlayer,
    tickRef,
    usableRef,
  ]);

  // Uso único por forma: o gate volta a liberar quando a forma sai.
  useEffect(() => {
    if (!vastolordActive && !activeRef.current) {
      laserUsedRef.current = false;
    }
  }, [vastolordActive]);

  useEffect(() => {
    return () => {
      clearTimer();
      activeRef.current = false;
    };
  }, [clearTimer]);

  return {
    beam,
    press,
    usable: usableRef.current,
  };
}