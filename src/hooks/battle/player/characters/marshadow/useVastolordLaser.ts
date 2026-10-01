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
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { SPECIAL_INTRO_DURATION } from "@/hooks/battle/modals/useSpecialIntro";
import type { MarceloBattleForm } from "@/utils/paths";
import { ProjectileConstants } from "@/data/projectile";
import { ALL_PREDICATES } from "@/gameRules/battle/playerStates";
import { clampX } from "@/gameRules/movement/clampX";
import { combatService } from "@/services/combat";
import type { SoundId } from "@/utils/audio/soundId";
import type { NPCBattleState, SummonedNpc } from "@/utils/types/npc/npc";
import { useSkillGuard } from "@/hooks/battle/player/characters/useSkillGuard";
import {
  VASTOLORD_LASER_DAMAGE_RATIO,
  VASTOLORD_LASER_DURATION_MS,
  VASTOLORD_LASER_PUSH_PX,
  VASTOLORD_LASER_BEAM_HEIGHT,
  VASTOLORD_LASER_START_STACKS,
  VASTOLORD_LASER_TICK_MS,
} from "@/data/characters/marshadowLaser";
import {
  vastolordLaserTop,
  type VastolordLaserBeam,
} from "@/gameRules/battle/vastolordLaser";

type Props = {
  player: Player;
  setPlayer: Dispatch<SetStateAction<Player>>;
  /** PLAYER_SIZE do layout — ancora o feixe na imagem renderizada do personagem. */
  PLAYER_SIZE: number;
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
  /** Registra dano causado pelo player (combo/energia amaldiçoada/passivas). */
  registerHitRef: RefObject<(damage: number) => void>;
  freezeActionsUntilRef: RefObject<number>;
  isPausedRef: RefObject<boolean>;
  battleEndedRef: RefObject<boolean>;
  disabledRef: RefObject<boolean>;
  /** specialIntro: abre o background da habilidade (vastolordForm/habilities/laser/...). */
  startSpecialIntro: (
    character: string,
    onActivate: () => void,
    ability?: string,
    form?: MarceloBattleForm,
  ) => boolean;
  playSound: (sound: SoundId, loop?: boolean, volumeOverride?: number) => void;
};

type VastolordLaserApi = {
  beam: VastolordLaserBeam | null;
  press: () => void;
  usable: boolean;
  /** Stacks de Laser disponíveis na Forma Vastolord (cada kill adiciona +1). */
  stacks: number;
  /** +1 stack ao derrotar um inimigo (incluindo minions) na forma. */
  addCharge: () => void;
};

/**
 * Laser da Forma Vastolord do marcelo (uma vez por forma): o `press` consome o
 * stack e abre o `SpecialIntro` (background `vastolordForm/habilities/laser/`
 * por 1s em slow-motion, com o personagem travado); ao fim do intro o
 * personagem troca para o sprite `laser.svg` e um feixe (`vastolordLaser.svg`)
 * sai até a ponta do mapa na direção que ele mira, por 3s, centralizado na
 * imagem do personagem (centro do feixe alinhado ao centro vertical do sprite
 * renderizado). A cada 20ms, todo inimigo dentro da faixa do feixe sofre 1% do
 * dano base do personagem e é empurrado 10px para longe do jogador (parando
 * nas bordas via BATTLE_LIMITS). O jogador fica travado no disparo durante os
 * 3s; a habilidade só pode ser usada UMA vez por forma.
 */
export function useVastolordLaser({
  player,
  setPlayer,
  PLAYER_SIZE,
  vastolordActive,
  char,
  playerClass,
  npc,
  summons,
  setSummons,
  setNpcHP,
  giveSummonRewards,
  spawnDamageNumber,
  registerHitRef,
  freezeActionsUntilRef,
  isPausedRef,
  battleEndedRef,
  disabledRef,
  startSpecialIntro,
  playSound,
}: Props): VastolordLaserApi {
  const { stopSound } = useSoundEffects();
  const [beam, setBeam] = useState<VastolordLaserBeam | null>(null);
  /** Stacks de Laser durante a forma: começa em 1, cada kill adiciona +1,
   * cada disparo consome 1. Reativo p/ o botão reabilitar após kills. */
  const [laserStacks, setLaserStacks] = useState(0);

  const activeRef = useRef(false);
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

  const { usableRef, shouldCancelRef } = useSkillGuard({
    player,
    character: "marcelo",
    freezeActionsUntilRef,
    disabledRef,
    isPausedRef,
    battleEndedRef,
    extraCanUse: () => vastolordActive && laserStacks > 0,
    extraCancel: () => !vastolordActiveRef.current,
  });

  const clearTimer = useCallback(() => {
    if (tickTimerRef.current != null) {
      clearInterval(tickTimerRef.current);
      tickTimerRef.current = null;
    }
  }, []);

  /** Encerra o feixe (fim dos 3s ou cancelamento) e restaura o idle. */
  const finish = useCallback(() => {
    activeRef.current = false;
    stopSound("laser");
    clearTimer();
    accRef.current = 0;
    shotStartRef.current = 0;
    setBeam(null);
    setPlayer((p) =>
      p.mode !== "battle" || !ALL_PREDICATES.isLaser(p.state)
        ? p
        : { ...p, state: "idle" },
    );
  }, [clearTimer, setPlayer, stopSound]);

  const finishRef = useLatestRef(finish);

  /** +1 stack de Laser por inimigo derrotado durante a Forma Vastolord. */
  const addCharge = useCallback(() => {
    setLaserStacks((s) => s + 1);
  }, []);

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

      const beamData = beamRef.current;
      if (!beamData) return;
      const { y: beamY, fromX, toX } = beamData;
      const top = vastolordLaserTop(beamY, PLAYER_SIZE);
      const bottom = top + VASTOLORD_LASER_BEAM_HEIGHT;

      // NPC principal: dano + empurrão para longe do jogador (clampado).
      const mainNpc = npcRef.current;
      if (
        mainNpc.y >= top &&
        mainNpc.y <= bottom &&
        mainNpc.x >= fromX &&
        mainNpc.x <= toX
      ) {
        setNpcHP((hp) => Math.max(0, hp - applied));
        spawnDamageNumber(applied, mainNpc.x, mainNpc.y, "npc");
        registerHitRef.current?.(applied);
        const dir = mainNpc.x >= playerRef.current.x ? 1 : -1;
        mainNpc.updateNpc({
          x: clampX(mainNpc.x + dir * VASTOLORD_LASER_PUSH_PX),
        });
      }

      // Summons inimigos: mesmo dano/empurrão; kill vira recompensa rare.
      let changed = false;
      let killed = false;
      const nextSummons = summonsRef.current.map((s) => {
        if (
          s.isDying ||
          s.y < top ||
          s.y > bottom ||
          s.x < fromX ||
          s.x > toX
        ) {
          return s;
        }
        changed = true;
        const newHp = Math.max(0, s.hp - applied);
        spawnDamageNumber(applied, s.x, s.y, "summon");
        registerHitRef.current?.(applied);
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
        addCharge();
      }
    }, [
      PLAYER_SIZE,
      addCharge,
      baseDamageRef,
      beamRef,
      finishRef,
      giveSummonRewards,
      npcRef,
      playerRef,
      registerHitRef,
      setNpcHP,
      setSummons,
      shouldCancelRef,
      spawnDamageNumber,
      summonsRef,
    ]),
  );

  /** Dispara o feixe: estado "laser", sprite, som em loop e o tick de dano. */
  const fire = useCallback(() => {
    // O intro (1s) terminou em pausa/fim de batalha ou a forma já expirou: o
    // stack foi gasto no `press`, mas o feixe não sai.
    if (shouldCancelRef.current()) {
      activeRef.current = false;
      return;
    }
    accRef.current = 0;
    const p = playerRef.current;
    shotStartRef.current = Date.now();
    freezeActionsUntilRef.current = Math.max(
      freezeActionsUntilRef.current,
      Date.now() + VASTOLORD_LASER_DURATION_MS,
    );
    // O feixe sai do personagem até a ponta do mapa na direção que ele mira.
    const isFacingLeft = p.battleDirection === "left";
    setBeam({
      fromX: isFacingLeft ? 0 : p.x,
      toX: isFacingLeft ? p.x : ProjectileConstants.MAP_WIDTH,
      y: p.y,
    });
    setPlayer((pp) => (pp.mode !== "battle" ? pp : { ...pp, state: "laser" }));
    // O som do feixe fica em loop enquanto o laser estiver ativo.
    playSound("laser", true);

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
    shouldCancelRef,
    tickRef,
  ]);

  const fireRef = useLatestRef(fire);

  const press = useCallback(() => {
    if (activeRef.current) return;
    if (!usableRef.current) return;

    activeRef.current = true;
    // A stack é consumida no ato: o intro já conta como o custo, mesmo se o
    // feixe só sair um segundo depois.
    setLaserStacks((s) => Math.max(0, s - 1));
    // O intro segura o personagem antes do feixe (senão ele andaria/ viraria
    // de lado durante o slow-motion e o feixe sairia na direção errada).
    freezeActionsUntilRef.current = Math.max(
      freezeActionsUntilRef.current,
      Date.now() + SPECIAL_INTRO_DURATION,
    );

    // O specialIntro (1s em slow-motion) mostra o background do laser; o feixe
    // entra logo depois. Se já houver um intro em andamento o callback não
    // roda, então o disparo acontece na hora.
    if (
      !startSpecialIntro(
        "marcelo",
        () => fireRef.current(),
        "laser",
        "vastolordForm",
      )
    ) {
      fireRef.current();
    }
  }, [freezeActionsUntilRef, fireRef, startSpecialIntro, usableRef]);

  // Stacks: a forma libera VASTOLORD_LASER_START_STACKS ao entrar e zera ao sair.
  useEffect(() => {
    setLaserStacks(vastolordActive ? VASTOLORD_LASER_START_STACKS : 0);
  }, [vastolordActive]);

  useEffect(() => {
    return () => {
      clearTimer();
      stopSound("laser");
      activeRef.current = false;
    };
  }, [clearTimer, stopSound]);

  return {
    beam,
    press,
    usable: usableRef.current,
    stacks: laserStacks,
    addCharge,
  };
}
