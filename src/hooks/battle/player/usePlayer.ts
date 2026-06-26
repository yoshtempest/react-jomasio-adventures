import { useState, useCallback } from "react";
import { canPlayerHit } from "@/gameRules/battle/combat";
import { playAttackSound } from "@/utils/types/battle/playAttackSound";
import {
  calculatePlayerDamage,
  calculateSpecialDamage,
  calculateDamageToNpc,
  getBerserkMultiplier,
} from "@/gameRules/battle/damage";
import { rollCrit } from "@/gameRules/battle/damageUtils";
import type { DamageType } from "@/hooks/battle/damage/useNumbers";
import type { BattleBehavior } from "@/utils/types/player/behavior";
import type { CharacterProgress } from "@/data/characters/defaultProgress";
import { asset } from "@/utils/asset";

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
  setPlayerHP: React.Dispatch<React.SetStateAction<number>>;
  playerHP: number;
  playerMaxHp: number;
  totalVampirism: number;
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
  setPlayer,
  onBeforeNpcHitRef,
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

    if (onBeforeNpcHitRef?.current?.()) {
      playerCooldown.current = false;
      setTimeout(() => {
        playerCooldown.current = true;
      }, 400);
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
    const berserkDmg =
      player.character === "samuel" && char.level >= 20
        ? Math.round(rawDmg * getBerserkMultiplier(playerHP, playerMaxHp))
        : rawDmg;
    const { damage: critDmg, type: dmgType } = rollCrit(berserkDmg, critRate);
    if (dmgType === "crit") setPlayer((p) => ({ ...p, state: "crit" }));
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

    if (totalVampirism > 0) {
      const heal = Math.round(dmg * totalVampirism / 100);
      if (heal > 0) setPlayerHP((hp) => Math.min(playerMaxHp, hp + heal));
    }

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
    playerHP,
    setPlayerHP,
    playerMaxHp,
    totalVampirism,
    onBeforeNpcHitRef,
    setPlayer,
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

    if (onBeforeNpcHitRef?.current?.()) {
      playerCooldown.current = false;
      setTimeout(() => {
        playerCooldown.current = true;
      }, 600);
      return;
    }

    if (player.character === "marcelo") {
      const audio = new Audio(asset("/assets/songs/soundEffects/player/marcelo/special.mp3"));
      audio.play().catch(() => {});
    }

    navigator.vibrate?.(30);

    const isLarissa = player.character === "larissa";
    const rawDmg = isLarissa
      ? stacks * 5
      : calculateSpecialDamage(char.stats.intelligence, playerClass);
    const berserkDmg =
      player.character === "samuel" && char.level >= 20
        ? Math.round(rawDmg * getBerserkMultiplier(playerHP, playerMaxHp))
        : rawDmg;
    const { damage: critDmg, type: dmgType } = rollCrit(berserkDmg, critRate);
    if (dmgType === "crit") setPlayer((p) => ({ ...p, state: "crit" }));
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

    if (totalVampirism > 0) {
      const heal = Math.round(dmg * totalVampirism / 100);
      if (heal > 0) setPlayerHP((hp) => Math.min(playerMaxHp, hp + heal));
    }

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
    setPlayerHP,
    playerMaxHp,
    totalVampirism,
    stacks,
    triggerExplosion,
    spawnDamageRef,
    hitstopRef,
    registerHitRef,
    critRate,
    npcArmor,
    playerHP,
    onBeforeNpcHitRef,
    setPlayer,
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
