import { useState, useCallback } from "react";
import {
  PLAYER_BASIC_COOLDOWN,
  PLAYER_SPECIAL_COOLDOWN,
} from "@/data/cooldowns";
import { canPlayerHit } from "@/gameRules/battle/combat";
import { applyBasicHit, applySpecialHit } from "@/gameRules/battle/applyHit";
import type { BattleBehavior } from "@/utils/types/player/behavior";
import type { CharacterProgress } from "@/data/characters/defaultProgress";
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
  playerState: playerState;
  npcClass: NPCClass;

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
  onCortaCura?: () => void;
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
  spawnPiercing,
  triggerExplosion,
  titleDamageBonus,
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
  onCortaCura,
}: Props) {
  const { playSound } = useSoundEffects();

  const [delicia, setDelicia] = useState(0);
  const [stacks, setStacks] = useState(0);

  const playerHit = useCallback(
    (damageMultiplier = 1, bypassCanPlayerHit = false) => {
      if (isEnding.current) return;
      if (!playerCooldown.current) return;

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

      if (onBeforeNpcHitRef?.current?.()) {
        playerCooldown.current = false;
        setTimeout(() => {
          playerCooldown.current = true;
        }, PLAYER_BASIC_COOLDOWN);
        return;
      }

      applyBasicHit({
        player,
        playerClass,
        char,
        behavior,
        titleDamageBonus,
        critRate,
        npcArmor,
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
        damageMultiplier,
        npcX,
        npcY,
        spawnPiercing,
        setDelicia,
        setStacks,
        HITS_TO_SPECIAL,
      });

      onCortaCura?.();

      playerCooldown.current = false;
      setTimeout(() => {
        playerCooldown.current = true;
      }, PLAYER_BASIC_COOLDOWN);
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
      onCortaCura,
      npcClass,
    ],
  );

  const specialHit = useCallback(
    (damageMultiplier = 1, bypassRangeCheck = false) => {
      if (isEnding.current) return;
      if (!playerCooldown.current) return;
      if (delicia < HITS_TO_SPECIAL) return;

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

      if (onBeforeNpcHitRef?.current?.()) {
        playerCooldown.current = false;
        setTimeout(() => {
          playerCooldown.current = true;
        }, PLAYER_SPECIAL_COOLDOWN);
        return;
      }

      if (player.character === "marcelo") {
        playSound("marshadowSpecial");
        logPlay("marshadowSpecial");
      }

      applySpecialHit({
        player,
        playerClass,
        char,
        behavior,
        titleDamageBonus,
        critRate,
        npcArmor,
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
        damageMultiplier,
        npcX,
        npcY,
        stacks,
        setStacks,
        triggerExplosion,
        setDelicia,
        hitsToSpecial: HITS_TO_SPECIAL,
      });

      onCortaCura?.();

      playerCooldown.current = false;
      setTimeout(() => {
        playerCooldown.current = true;
      }, PLAYER_SPECIAL_COOLDOWN);
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
      onCortaCura,
      playSound,
      titleDamageBonus,
      npcClass,
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
