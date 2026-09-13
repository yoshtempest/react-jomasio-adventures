import { useState, useCallback } from "react";
import {
  PLAYER_BASIC_COOLDOWN,
  PLAYER_SPECIAL_COOLDOWN,
} from "@/data/cooldowns";
import { canPlayerHit } from "@/gameRules/battle/combat";
import { LUCAS_WEAPON_RANGES } from "@/data/characters/lucasWeapons";
import { DIVERGENT_FIST_DELAY_MS } from "@/gameRules/battle/cursedEnergy";
import {
  applyBasicHit,
  applySpecialHit,
  calculateBasicHitDamage,
  calculateSpecialHitDamage,
} from "@/gameRules/battle/applyHit";
import {
  isPlayerBlind,
  isPlayerConfused,
  isPlayerFrozen,
  isPlayerParalyzed,
} from "@/gameRules/battle/status/statusEffects";
import type { BattleBehavior } from "@/utils/types/player/behavior";
import type { CharacterProgress } from "@/data/characters/defaultProgress";
import type { ElementType } from "@/utils/types/battle/element";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { logPlay } from "@/utils/replay/audioEventLog";
import { resetCooldownRef } from "@/utils/battle/cooldown";

type Props = {
  player: Player;
  playerClass: PlayerClass;
  char: CharacterProgress;
  behavior: BattleBehavior;

  playerX: number;
  playerY: number;
  npcX: number;
  npcY: number;
  playerState: PlayerState;
  npcClass: NPCClass;
  npcElementTypes: readonly ElementType[];
  weapon?: LucasWeapon;

  HITS_TO_SPECIAL: number;

  setNpcHP: React.Dispatch<React.SetStateAction<number>>;
  setPlayerHP: React.Dispatch<React.SetStateAction<number>>;
  playerHP: number;
  playerMaxHp: number;
  totalVampirism: number;
  totalMaxHpDamage: number;
  totalTrueDamage: number;
  playerCooldown: React.RefObject<boolean>;
  isEnding: React.RefObject<boolean>;

  spawnPiercing: () => void;
  triggerExplosion: () => void;
  titleDamageBonus: number;
  elementDamageBonus: number;
  critRate: number;
  npcArmor: number;
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
  hitstopRef: React.RefObject<number>;
  registerHitRef: React.RefObject<(damage: number) => void>;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  /** Devolve o multiplicador atual do ataque básico do artur (escala ORA). */
  arturOraMultiplierRef?: React.RefObject<() => number>;
  /** Devolve o multiplicador atual da Forma Vastolord do marcelo. */
  vastolordMultiplierRef?: React.RefObject<() => number>;
  /** Punho Divergente do riquelme: true quando o próximo ataque dobra o dano. */
  divergentFistRef?: React.RefObject<boolean>;
  /** Dispara quando o Punho Divergente é consumido pelo golpe. */
  onDivergentFistConsumedRef?: React.RefObject<() => void>;
  onBeforeNpcHitRef?: React.RefObject<() => boolean>;
  onDamageDealtRef?: React.RefObject<(amount: number) => void>;
  onAttackRef?: React.RefObject<() => void>;
  onSpecialRef?: React.RefObject<() => void>;
  onKokusenRef?: React.RefObject<() => void>;
  onBlackFlashRef?: React.RefObject<() => void>;
  onCriticalPushRef?: React.RefObject<() => void>;
  onHalfHeal?: () => void;
};

export function usePlayerBattle({
  player,
  playerClass,
  char,
  behavior,
  HITS_TO_SPECIAL,
  setNpcHP,
  setPlayerHP,
  playerHP,
  playerMaxHp,
  totalVampirism,
  totalMaxHpDamage,
  totalTrueDamage,
  playerCooldown,
  isEnding,
  playerX,
  playerY,
  npcX,
  npcY,
  playerState,
  npcClass,
  npcElementTypes,
  weapon,
  spawnPiercing,
  triggerExplosion,
  titleDamageBonus,
  elementDamageBonus,
  critRate,
  npcArmor,
  spawnDamageRef,
  hitstopRef,
  registerHitRef,
  setPlayer,
  arturOraMultiplierRef,
  vastolordMultiplierRef,
  divergentFistRef,
  onDivergentFistConsumedRef,
  onBeforeNpcHitRef,
  onDamageDealtRef,
  onAttackRef,
  onSpecialRef,
  onKokusenRef,
  onBlackFlashRef,
  onCriticalPushRef,
  onHalfHeal,
}: Props) {
  const { playSound } = useSoundEffects();

  const [delicia, setDelicia] = useState(0);
  const [stacks, setStacks] = useState(0);

  const playerHit = useCallback(
    (
      damageMultiplier = 1,
      bypassCanPlayerHit = false,
      bypassCooldown = false,
    ) => {
      if (isEnding.current) return;
      if (!playerCooldown.current && !bypassCooldown) return;

      // Ataque básico do artur escala pelo count de extraPunches na tela.
      // Forma Vastolord multiplica o dano do marcelo por 4.
      const vastolordMult = vastolordMultiplierRef?.current?.() ?? 1;
      const mult =
        (arturOraMultiplierRef?.current &&
        player.character === "artur" &&
        damageMultiplier === 1
          ? (arturOraMultiplierRef.current() ?? damageMultiplier)
          : damageMultiplier) * vastolordMult;

      const guard = evaluateStatusGuards(player);
      if (guard === "frozen") return;

      if (
        !bypassCanPlayerHit &&
        !canPlayerHit({
          playerX,
          playerY,
          npcX,
          npcY,
          playerState,
          character: player.character,
          direction: player.battleDirection,
          isSpecial: false,
          npcClass,
          rangeOverride: weapon ? LUCAS_WEAPON_RANGES[weapon] : undefined,
        })
      ) {
        return;
      }

      if (guard === "blind") {
        spawnDamageRef.current?.(0, npcX, npcY, "miss");
        resetCooldownRef(PLAYER_BASIC_COOLDOWN, playerCooldown);
        return;
      }

      if (onBeforeNpcHitRef?.current?.()) {
        resetCooldownRef(PLAYER_BASIC_COOLDOWN, playerCooldown);
        return;
      }

      if (guard === "confused") {
        const { damage: selfDmg } = calculateBasicHitDamage({
          player,
          playerClass,
          char,
          titleDamageBonus,
          elementDamageBonus,
          critRate,
          npcArmor,
          npcElementTypes: [],
          playerHP,
          playerMaxHp,
          totalMaxHpDamage,
          totalTrueDamage,
          damageMultiplier: mult,
        });
        if (selfDmg > 0) {
          setPlayerHP((hp) => Math.max(0, hp - selfDmg));
          spawnDamageRef.current?.(selfDmg, playerX, playerY, "confuse");
        }
        resetCooldownRef(PLAYER_BASIC_COOLDOWN, playerCooldown);
        return;
      }

      const runBasicHit = () =>
        applyBasicHit({
          player,
          playerClass,
          char,
          behavior,
          titleDamageBonus,
          elementDamageBonus,
          critRate,
          npcArmor,
          npcElementTypes,
          playerHP,
          playerMaxHp,
          totalVampirism,
          totalMaxHpDamage,
          totalTrueDamage,
          setNpcHP,
          setPlayerHP,
          setPlayer,
          spawnDamageRef,
          registerHitRef,
          hitstopRef,
          onDamageDealtRef,
          onAttackRef,
          onKokusenRef,
          onBlackFlashRef,
          onCriticalPushRef,
          damageMultiplier: mult,
          npcX,
          npcY,
          spawnPiercing,
          setDelicia,
          setStacks,
          HITS_TO_SPECIAL,
        });

      const isDivergentFist = divergentFistRef?.current === true;
      runBasicHit();

      if (isDivergentFist) {
        divergentFistRef.current = false;
        onDivergentFistConsumedRef?.current?.();
        setTimeout(() => {
          if (isEnding.current) return;
          runBasicHit();
        }, DIVERGENT_FIST_DELAY_MS);
      }

      if (onHalfHeal) onHalfHeal();

      resetCooldownRef(PLAYER_BASIC_COOLDOWN, playerCooldown);
    },
    [
      isEnding,
      player,
      playerCooldown,
      playerX,
      playerY,
      npcX,
      npcY,
      playerState,
      behavior,
      char,
      playerClass,
      setNpcHP,
      HITS_TO_SPECIAL,
      spawnPiercing,
      titleDamageBonus,
      elementDamageBonus,
      spawnDamageRef,
      hitstopRef,
      registerHitRef,
      onDamageDealtRef,
      critRate,
      npcArmor,
      playerHP,
      setPlayerHP,
      playerMaxHp,
      totalVampirism,
      totalMaxHpDamage,
      totalTrueDamage,
      onBeforeNpcHitRef,
      setPlayer,
      onAttackRef,
      onKokusenRef,
      onBlackFlashRef,
      onCriticalPushRef,
      onHalfHeal,
      npcClass,
      npcElementTypes,
      weapon,
      arturOraMultiplierRef,
      vastolordMultiplierRef,
      divergentFistRef,
      onDivergentFistConsumedRef,
    ],
  );

  const specialHit = useCallback(
    (damageMultiplier = 1, bypassRangeCheck = false) => {
      if (isEnding.current) return;
      if (!playerCooldown.current) return;
      if (delicia < HITS_TO_SPECIAL) return;

      const vastolordMult = vastolordMultiplierRef?.current?.() ?? 1;
      const totalMultiplier = damageMultiplier * vastolordMult;

      const guard = evaluateStatusGuards(player);
      if (guard === "frozen") return;

      if (
        !bypassRangeCheck &&
        !canPlayerHit({
          playerX,
          playerY,
          npcX,
          npcY,
          playerState,
          character: player.character,
          direction: player.battleDirection,
          isSpecial: true,
          npcClass,
          rangeOverride: weapon ? LUCAS_WEAPON_RANGES[weapon] : undefined,
        })
      ) {
        return;
      }

      if (guard === "blind") {
        spawnDamageRef.current?.(0, npcX, npcY, "miss");
        setDelicia(0);
        resetCooldownRef(PLAYER_SPECIAL_COOLDOWN, playerCooldown);
        return;
      }

      if (onBeforeNpcHitRef?.current?.()) {
        resetCooldownRef(PLAYER_SPECIAL_COOLDOWN, playerCooldown);
        return;
      }

      if (guard === "confused") {
        const { damage: selfDmg } = calculateSpecialHitDamage({
          player,
          playerClass,
          char,
          elementDamageBonus,
          critRate,
          npcArmor,
          npcElementTypes: [],
          playerHP,
          playerMaxHp,
          totalMaxHpDamage,
          totalTrueDamage,
          damageMultiplier: totalMultiplier,
          stacks,
        });
        if (selfDmg > 0) {
          setPlayerHP((hp) => Math.max(0, hp - selfDmg));
          spawnDamageRef.current?.(selfDmg, playerX, playerY, "confuse");
        }
        setDelicia(0);
        resetCooldownRef(PLAYER_SPECIAL_COOLDOWN, playerCooldown);
        return;
      }

      if (player.character === "riquelme") {
        playSound("impact");
        logPlay("impact");
      }

      applySpecialHit({
        player,
        playerClass,
        char,
        behavior,
        titleDamageBonus,
        elementDamageBonus,
        critRate,
        npcArmor,
        npcElementTypes,
        playerHP,
        playerMaxHp,
        totalVampirism,
        totalMaxHpDamage,
        totalTrueDamage,
        setNpcHP,
        setPlayerHP,
        setPlayer,
        spawnDamageRef,
        registerHitRef,
        hitstopRef,
        onDamageDealtRef,
        onSpecialRef,
        onKokusenRef,
        onBlackFlashRef,
        onCriticalPushRef,
        damageMultiplier: totalMultiplier,
        npcX,
        npcY,
        stacks,
        setStacks,
        triggerExplosion,
        setDelicia,
        hitsToSpecial: HITS_TO_SPECIAL,
      });

      if (onHalfHeal) onHalfHeal();

      resetCooldownRef(PLAYER_SPECIAL_COOLDOWN, playerCooldown);
    },
    [
      isEnding,
      player,
      delicia,
      HITS_TO_SPECIAL,
      playerCooldown,
      playerX,
      playerY,
      npcX,
      npcY,
      playerState,
      behavior,
      char,
      playerClass,
      setNpcHP,
      setPlayerHP,
      playerMaxHp,
      totalVampirism,
      totalMaxHpDamage,
      totalTrueDamage,
      stacks,
      triggerExplosion,
      spawnDamageRef,
      hitstopRef,
      registerHitRef,
      onDamageDealtRef,
      critRate,
      npcArmor,
      playerHP,
      onBeforeNpcHitRef,
      setPlayer,
      onSpecialRef,
      onKokusenRef,
      onBlackFlashRef,
      onCriticalPushRef,
      onHalfHeal,
      playSound,
      titleDamageBonus,
      elementDamageBonus,
      npcClass,
      npcElementTypes,
      weapon,
      vastolordMultiplierRef,
    ],
  );

  return {
    delicia,
    stacks,
    setStacks,
    setDelicia,
    playerHit,
    specialHit,
  };
}

function evaluateStatusGuards(
  player: Player,
): "frozen" | "blind" | "confused" | "ok" {
  if (isPlayerFrozen(player) || isPlayerParalyzed(player)) return "frozen";
  if (isPlayerBlind(player)) return "blind";
  if (isPlayerConfused(player) && Math.random() < 0.5) return "confused";
  return "ok";
}
