import { useState, useCallback } from "react";
import {
  PLAYER_BASIC_COOLDOWN,
  PLAYER_SPECIAL_COOLDOWN,
} from "@/data/cooldowns";
import { canPlayerHit } from "@/gameRules/battle/combat";
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
  onBeforeNpcHitRef?: React.RefObject<() => boolean>;
  onDamageDealtRef?: React.RefObject<(amount: number) => void>;
  onAttackRef?: React.RefObject<() => void>;
  onSpecialRef?: React.RefObject<() => void>;
  onKokusenRef?: React.RefObject<() => void>;
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
  onBeforeNpcHitRef,
  onDamageDealtRef,
  onAttackRef,
  onSpecialRef,
  onKokusenRef,
  onHalfHeal,
}: Props) {
  const { playSound } = useSoundEffects();

  const [delicia, setDelicia] = useState(0);
  const [stacks, setStacks] = useState(0);

  const playerHit = useCallback(
    (damageMultiplier = 1, bypassCanPlayerHit = false) => {
      if (isEnding.current) return;
      if (!playerCooldown.current) return;

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
        })
      ) {
        return;
      }

      if (guard === "blind") {
        spawnDamageRef.current?.(0, npcX, npcY, "miss");
        resetCooldown(PLAYER_BASIC_COOLDOWN, playerCooldown);
        return;
      }

      if (onBeforeNpcHitRef?.current?.()) {
        resetCooldown(PLAYER_BASIC_COOLDOWN, playerCooldown);
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
          damageMultiplier,
        });
        if (selfDmg > 0) {
          setPlayerHP((hp) => Math.max(0, hp - selfDmg));
          spawnDamageRef.current?.(selfDmg, playerX, playerY, "confuse");
        }
        resetCooldown(PLAYER_BASIC_COOLDOWN, playerCooldown);
        return;
      }

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
        damageMultiplier,
        npcX,
        npcY,
        spawnPiercing,
        setDelicia,
        setStacks,
        HITS_TO_SPECIAL,
      });

      if (onHalfHeal) onHalfHeal();

      resetCooldown(PLAYER_BASIC_COOLDOWN, playerCooldown);
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
      onHalfHeal,
      npcClass,
      npcElementTypes,
    ],
  );

  const specialHit = useCallback(
    (damageMultiplier = 1, bypassRangeCheck = false) => {
      if (isEnding.current) return;
      if (!playerCooldown.current) return;
      if (delicia < HITS_TO_SPECIAL) return;

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
        })
      ) {
        return;
      }

      if (guard === "blind") {
        spawnDamageRef.current?.(0, npcX, npcY, "miss");
        setDelicia(0);
        resetCooldown(PLAYER_SPECIAL_COOLDOWN, playerCooldown);
        return;
      }

      if (onBeforeNpcHitRef?.current?.()) {
        resetCooldown(PLAYER_SPECIAL_COOLDOWN, playerCooldown);
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
          damageMultiplier,
          stacks,
        });
        if (selfDmg > 0) {
          setPlayerHP((hp) => Math.max(0, hp - selfDmg));
          spawnDamageRef.current?.(selfDmg, playerX, playerY, "confuse");
        }
        setDelicia(0);
        resetCooldown(PLAYER_SPECIAL_COOLDOWN, playerCooldown);
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
        damageMultiplier,
        npcX,
        npcY,
        stacks,
        setStacks,
        triggerExplosion,
        setDelicia,
        hitsToSpecial: HITS_TO_SPECIAL,
      });

      if (onHalfHeal) onHalfHeal();

      resetCooldown(PLAYER_SPECIAL_COOLDOWN, playerCooldown);
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
      onHalfHeal,
      playSound,
      titleDamageBonus,
      elementDamageBonus,
      npcClass,
      npcElementTypes,
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

function resetCooldown(
  cooldownMs: number,
  playerCooldown: React.RefObject<boolean>,
) {
  playerCooldown.current = false;
  setTimeout(() => {
    playerCooldown.current = true;
  }, cooldownMs);
}
