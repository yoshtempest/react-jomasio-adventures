import { useState, useCallback } from "react";
import { canPlayerHit } from "@/gameRules/battle/combat";
import { playAttackSound } from "@/utils/playAttackSound";
import {
  calculatePlayerDamage,
  calculateSpecialDamage,
  calculateDamageToNpc,
} from "@/gameRules/battle/damage";
import { rollCrit } from "@/gameRules/battle/damageUtils";
import type { DamageType } from "@/hooks/battle/useDamageNumbers";
import type { BattleBehavior } from "@/utils/types/player/behavior";
import type { CharacterProgress } from "@/contexts/CharacterProgressContext";

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

  HITS_TO_SPECIAL: number;

  setNpcHP: React.Dispatch<React.SetStateAction<number>>;
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
};

export function usePlayerBattle({
  player,
  playerClass,
  char,
  behavior,
  HITS_TO_SPECIAL,
  setNpcHP,
  playerCooldown,
  isEnding,
  playerX,
  playerY,
  npcX,
  npcY,
  playerState,
  spawnPiercing,
  triggerExplosion,
  titleDamageBonus,
  critRate,
  npcArmor,
  spawnDamageRef,
  hitstopRef,
  registerHitRef,
}: Props) {
  const [delicia, setDelicia] = useState(0);
  const [stacks, setStacks] = useState(0);

  const playerHit = useCallback(() => {
    if (isEnding.current) return;
    if (!playerCooldown.current) return;

    if (
      !canPlayerHit({
        playerX,
        playerY,
        npcX,
        npcY,
        playerState,
        character: player.character,
        direction: player.battleDirection,
        isSpecial: false,
      })
    ) {
      return;
    }

    playAttackSound(player.character);
    navigator.vibrate?.(20);

    const isLarissa = player.character === "larissa";
    const rawDmg = isLarissa
      ? 2
      : calculatePlayerDamage(
          char.stats.strength,
          playerClass,
          titleDamageBonus,
        );
    const { damage: critDmg, type: dmgType } = rollCrit(rawDmg, critRate);
    const dmg = calculateDamageToNpc(critDmg, npcArmor);

    behavior.onBasicHit({
      damage: dmg,
      setNpcHP,
      char,
      playerClass,
      setDelicia,
      HITS_TO_SPECIAL,
      setStacks,
      spawnPiercing,
      titleDamageBonus,
    });

    spawnDamageRef.current?.(dmg, npcX, npcY, dmgType);
    registerHitRef.current?.(dmg);
    hitstopRef.current = Date.now() + 60;

    playerCooldown.current = false;

    setTimeout(() => {
      playerCooldown.current = true;
    }, 400);
  }, [
    isEnding,
    playerCooldown,
    playerX,
    playerY,
    npcX,
    npcY,
    playerState,
    player.character,
    player.battleDirection,
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
    critRate,
    npcArmor,
  ]);

  const specialHit = useCallback(() => {
    if (isEnding.current) return;
    if (!playerCooldown.current) return;
    if (delicia < HITS_TO_SPECIAL) return;

    if (
      !canPlayerHit({
        playerX,
        playerY,
        npcX,
        npcY,
        playerState,
        character: player.character,
        direction: player.battleDirection,
        isSpecial: true,
      })
    ) {
      return;
    }

    navigator.vibrate?.(30);

    const isLarissa = player.character === "larissa";
    const rawDmg = isLarissa
      ? stacks * 5
      : calculateSpecialDamage(char.stats.intelligence, playerClass);
    const { damage: critDmg, type: dmgType } = rollCrit(rawDmg, critRate);
    const dmg = calculateDamageToNpc(critDmg, npcArmor);

    behavior.onSpecialHit({
      damage: dmg,
      setNpcHP,
      char,
      playerClass,
      setDelicia,
      stacks,
      setStacks,
      triggerExplosion,
    });

    spawnDamageRef.current?.(dmg, npcX, npcY, dmgType);
    registerHitRef.current?.(dmg);
    hitstopRef.current = Date.now() + 100;

    playerCooldown.current = false;

    setTimeout(() => {
      playerCooldown.current = true;
    }, 600);
  }, [
    isEnding,
    delicia,
    HITS_TO_SPECIAL,
    playerCooldown,
    playerX,
    playerY,
    npcX,
    npcY,
    playerState,
    player.character,
    player.battleDirection,
    behavior,
    char,
    playerClass,
    setNpcHP,
    stacks,
    triggerExplosion,
    spawnDamageRef,
    hitstopRef,
    registerHitRef,
    critRate,
    npcArmor,
  ]);

  return {
    delicia,
    stacks,
    setStacks,
    setDelicia,
    playerHit,
    specialHit,
  };
}
