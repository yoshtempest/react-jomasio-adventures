import { useCallback, useRef, useEffect } from "react";

import {
  PLAYER_BASIC_COOLDOWN,
  PLAYER_SPECIAL_COOLDOWN,
} from "@/data/cooldowns";
import { playAttackSound } from "@/utils/audio/playAttackSound";
import { isPlayerInRange } from "@/gameRules/battle/range";
import { NPC_CLASS_HITBOX_BONUS } from "@/gameRules/battle/rangeConfig";
import { isFacingTarget } from "@/gameRules/battle/direction";
import { damageSummon } from "@/gameRules/battle/damageSummon";
import { BLOCK_ATTACK_PUSH_DISTANCE } from "@/gameRules/movement/constants";
import { LUCAS_WEAPON_RANGES } from "@/data/characters/lucasWeapons";
import { PlayerSpecialConstants } from "@/data/projectile";
import { useBuildTargetList } from "./usePlayerTargeting";
import { resetCooldownRef } from "@/utils/battle/cooldown";
import {
  EMANUEL_COMBO_STEPS,
  EMANUEL_COMBO_STATES,
} from "@/data/characters/emanuel";

import type { SummonedNpc } from "@/utils/types/npc/npc";
import type { CharactersProgress } from "@/data/characters/defaultProgress";

type Props = {
  player: Player;
  npc: {
    x: number;
    y: number;
  };
  summons: SummonedNpc[];
  npcHP: number;
  npcClass: NPCClass;
  playerClass: PlayerClass;
  weapon?: LucasWeapon;
  progress: CharactersProgress;
  npcLevel: number;
  battle: {
    playerCooldown: React.RefObject<boolean>;
    isEnding: React.RefObject<boolean>;
    playerHit: (
      multiplier?: number,
      bypassCanPlayerHit?: boolean,
      bypassCooldown?: boolean,
    ) => void;
    specialHit: (multiplier?: number, bypassRangeCheck?: boolean) => void;
    setDelicia: React.Dispatch<React.SetStateAction<number>>;
    hitsToSpecial: number;
  };

  setSummons: React.Dispatch<React.SetStateAction<SummonedNpc[]>>;

  giveSummonRewards: (npcClass: NPCClass) => void;

  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
  registerHitRef: React.RefObject<(damage: number) => void>;

  setPlayerHP: React.Dispatch<React.SetStateAction<number>>;
  playerHP: number;
  playerMaxHp: number;
  totalVampirism: number;
  onNpcPush?: (targetX: number) => void;
  /** Multiplicador do último step do combo do emanuel (lido no press). */
  emanuelComboMultiplierRef?: React.RefObject<number>;
  /** true quando o último press do emanuel AVANÇOU o combo. */
  emanuelComboActiveRef?: React.RefObject<boolean>;
  /** Combo do emanuel: true durante a sequência aérea (airKick windup). */
  emanuelComboAirActiveRef?: React.RefObject<boolean>;
  /** Índice do último step do combo do emanuel (lido no press). */
  emanuelComboStepIndexRef?: React.RefObject<number>;
  /** Avança o player um passo em direção ao alvo atingido (combo do emanuel). */
  onComboAdvance?: (forwardDistance: number, targetX: number) => void;
};

export function usePlayerBattleActions({
  player,
  npc,
  summons,
  npcHP,
  npcClass,
  playerClass,
  weapon,
  progress,
  battle,
  setSummons,
  giveSummonRewards,
  spawnDamageRef,
  registerHitRef,
  setPlayerHP,
  playerHP,
  playerMaxHp,
  totalVampirism,
  onNpcPush,
  emanuelComboMultiplierRef,
  emanuelComboActiveRef,
  emanuelComboAirActiveRef,
  emanuelComboStepIndexRef,
  onComboAdvance,
}: Props) {
  const fallingAttackUsedRef = useRef(false);

  useEffect(() => {
    if (player.y === player.groundY) {
      fallingAttackUsedRef.current = false;
    }
  }, [player.y, player.groundY]);

  const { getTargets, isInAttackRange } = useBuildTargetList(
    player,
    npc,
    npcHP,
    summons,
    npcClass,
    weapon,
  );

  const hitSummon = useCallback(
    (
      target: { id: string; x: number; y: number },
      multiplier: number,
      pushDir?: number,
    ) => {
      return damageSummon({
        target,
        multiplier,
        player,
        playerClass,
        progress,
        playerHP,
        playerMaxHp,
        totalVampirism,
        summons,
        setSummons,
        giveSummonRewards,
        spawnDamageRef,
        registerHitRef,
        setPlayerHP,
        deliciaSetter: battle.setDelicia,
        hitsToSpecial: battle.hitsToSpecial,
        pushDir,
      });
    },
    [
      player,
      playerClass,
      progress,
      playerHP,
      playerMaxHp,
      totalVampirism,
      summons,
      setSummons,
      giveSummonRewards,
      spawnDamageRef,
      registerHitRef,
      setPlayerHP,
      battle,
    ],
  );

  const hitTargetList = useCallback(
    (
      targets: { id: string; x: number; y: number }[],
      multiplier: number,
      isSpecial: boolean,
    ) => {
      let hitMain = false;
      const pushDir = player.battleDirection === "right" ? 1 : -1;

      for (const target of targets) {
        if (target.id === "main") {
          hitMain = true;
          if (isSpecial) {
            battle.specialHit(multiplier, true);
          } else {
            onNpcPush?.(npc.x + pushDir * BLOCK_ATTACK_PUSH_DISTANCE);
            battle.playerHit(multiplier, true);
          }
          continue;
        }

        const targetSummon = summons.find((summon) => summon.id === target.id);
        if (!targetSummon) continue;

        hitSummon(target, multiplier, isSpecial ? undefined : pushDir);
      }

      if (!hitMain) {
        playAttackSound(player.character);
        resetCooldownRef(
          isSpecial ? PLAYER_SPECIAL_COOLDOWN : PLAYER_BASIC_COOLDOWN,
          battle.playerCooldown,
        );
      }
    },
    [player, npc.x, battle, onNpcPush, summons, hitSummon],
  );

  const handlePlayerHit = useCallback(() => {
    // Combo do emanuel: o multiplicador vem do passo avançado no último press
    // (sinal síncrono setado pelo attack() no useBattleMovement). Usamos
    // bypassCooldown=true porque o pacing do combo é a janela de 300ms, não o
    // cooldown básico de 400ms.
    const isEmanuelComboHit =
      player.character === "emanuel" &&
      emanuelComboActiveRef?.current === true &&
      emanuelComboMultiplierRef != null;
    const comboMultiplier = isEmanuelComboHit
      ? (emanuelComboMultiplierRef.current ?? 1)
      : 1;

    // Uma instância de dano por sprite do combo do emanuel: presses repetidos
    // durante a exibição de um golpe (mash/hold) que NÃO avançaram o combo não
    // podem vazar dano pelo caminho normal (cooldown básico de 400ms).
    if (
      player.character === "emanuel" &&
      player.mode === "battle" &&
      !isEmanuelComboHit &&
      (player.state === "preAttack" ||
        EMANUEL_COMBO_STATES.has(player.state) ||
        (player.state === "jump" &&
          emanuelComboAirActiveRef?.current === true))
    ) {
      return;
    }

    if (battle.isEnding.current) return;
    if (!isEmanuelComboHit && !battle.playerCooldown.current) {
      return;
    }

    const targets = getTargets();
    const mainTarget = targets.find((t) => t.id === "main");

    if (player.state === "blocked") {
      const areaTargets = targets.filter(
        (target) =>
          isPlayerInRange(
            player.x,
            player.y,
            target.x,
            target.y,
            player.state,
            player.character,
            false,
            true,
            target.id === "main" ? npcClass : "common",
            weapon && player.character === "lucas"
              ? LUCAS_WEAPON_RANGES[weapon]
              : undefined,
          ) &&
          isFacingTarget(
            player.x,
            player.y,
            target.x,
            target.y,
            player.battleDirection,
          ),
      );

      if (areaTargets.length === 0) return;

      hitTargetList(areaTargets, 0.7, false);
      return;
    }

    // Priority 1: hit main NPC (boss) if in range
    if (mainTarget && isInAttackRange(mainTarget)) {
      if (isEmanuelComboHit) {
        const stepIndex = emanuelComboStepIndexRef?.current ?? 0;
        const step = EMANUEL_COMBO_STEPS[stepIndex] ?? EMANUEL_COMBO_STEPS[0];
        const pushDir = player.battleDirection === "right" ? 1 : -1;
        onNpcPush?.(npc.x + pushDir * step.pushDistance);
        onComboAdvance?.(step.forwardDistance, mainTarget.x);
        battle.playerHit(comboMultiplier, false, true);
      } else if (player.state === "falling" && !fallingAttackUsedRef.current) {
        fallingAttackUsedRef.current = true;
        battle.playerHit(1.2);
      } else {
        battle.playerHit();
      }
      return;
    }

    // Priority 2: hit the closest summon in range (only one per attack)
    for (const target of targets) {
      if (target.id === "main") continue;
      if (!isInAttackRange(target)) continue;

      const targetSummon = summons.find((summon) => summon.id === target.id);
      if (!targetSummon) continue;

      playAttackSound(player.character);
      const pushDir = player.battleDirection === "right" ? 1 : -1;
      hitSummon(
        target,
        isEmanuelComboHit ? comboMultiplier : 1,
        isEmanuelComboHit ? pushDir : undefined,
      );

      if (isEmanuelComboHit) {
        const stepIndex = emanuelComboStepIndexRef?.current ?? 0;
        const step =
          EMANUEL_COMBO_STEPS[stepIndex] ?? EMANUEL_COMBO_STEPS[0];
        onComboAdvance?.(step.forwardDistance, target.x);
      } else {
        resetCooldownRef(PLAYER_BASIC_COOLDOWN, battle.playerCooldown);
      }

      return;
    }
  }, [
    player,
    summons,
    battle,
    getTargets,
    isInAttackRange,
    hitSummon,
    hitTargetList,
    npcClass,
    weapon,
    npc.x,
    onNpcPush,
    emanuelComboMultiplierRef,
    emanuelComboActiveRef,
    emanuelComboAirActiveRef,
    emanuelComboStepIndexRef,
    onComboAdvance,
  ]);

  const handleExtraPunch = useCallback(
    (multiplier: number): { x: number; y: number; isMain: boolean } | null => {
      if (battle.isEnding.current) return null;

      const targets = getTargets();
      const mainTarget = targets.find((t) => t.id === "main");

      if (mainTarget && isInAttackRange(mainTarget)) {
        battle.playerHit(multiplier, true, true);
        return { x: mainTarget.x, y: mainTarget.y, isMain: true };
      }

      for (const target of targets) {
        if (target.id === "main") continue;
        if (!isInAttackRange(target)) continue;

        const targetSummon = summons.find((summon) => summon.id === target.id);
        if (!targetSummon) continue;

        hitSummon(target, multiplier);
        return { x: target.x, y: target.y, isMain: false };
      }

      return null;
    },
    [battle, getTargets, isInAttackRange, summons, hitSummon],
  );

  const handleSpecialHit = useCallback(() => {
    if (!battle.playerCooldown.current || battle.isEnding.current) {
      return;
    }

    const targets = getTargets();

    const isAirSpecial =
      player.state === "falling" ||
      player.state === "jump" ||
      player.state === "preSpecialInAir" ||
      player.state === "specialInAir" ||
      player.state === "specialInAirFinish";

    if (isAirSpecial) {
      const inRangeTargets = targets.filter(
        (target) =>
          Math.abs(player.x - target.x) <
          150 + (target.id === "main" ? NPC_CLASS_HITBOX_BONUS[npcClass] : 0),
      );

      if (inRangeTargets.length === 0) {
        battle.setDelicia(0);
        return;
      }

      hitTargetList(inRangeTargets, 1.2, true);
      return;
    }

    if (player.character === "riquelme") {
      const dir = player.battleDirection === "right" ? 1 : -1;
      const inProjectileLine = (target: { x: number }) => {
        const dx = target.x - player.x;
        return (
          (dir === 1 ? dx >= 0 : dx <= 0) &&
          Math.abs(dx) <= PlayerSpecialConstants.FIRE_DISTANCE
        );
      };

      const pathTargets = targets.filter(inProjectileLine);
      const mainTarget = pathTargets.find((target) => target.id === "main");
      const summonTargets = pathTargets.filter(
        (target) => target.id !== "main",
      );

      let hitAny = false;

      if (mainTarget) {
        battle.specialHit();
        hitAny = true;
      }

      for (const target of summonTargets) {
        const targetSummon = summons.find((summon) => summon.id === target.id);
        if (!targetSummon) continue;
        hitSummon(target, 1, dir);
        hitAny = true;
      }

      if (!hitAny) battle.setDelicia(0);
      return;
    }

    for (const target of targets) {
      if (target.id === "main") {
        battle.specialHit();
        return;
      }
    }

    battle.setDelicia(0);
  }, [
    battle,
    getTargets,
    player.state,
    player.x,
    player.battleDirection,
    player.character,
    summons,
    hitSummon,
    hitTargetList,
    npcClass,
  ]);

  return {
    handlePlayerHit,
    handleSpecialHit,
    handleExtraPunch,
    hitTargetList,
  };
}
