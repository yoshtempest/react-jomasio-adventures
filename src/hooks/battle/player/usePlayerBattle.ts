import { useState, useCallback } from "react";
import { canPlayerHit } from "@/gameRules/battle/combat";
import type { PlayerClass, Player } from "@/utils/types/player/player";
import type { BattleBehavior } from "@/utils/types/player/playerBehavior";
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

    behavior.onBasicHit({
      setNpcHP,
      char,
      playerClass,
      setDelicia,
      HITS_TO_SPECIAL,
      setStacks,
      spawnPiercing,
    });

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

    behavior.onSpecialHit({
      setNpcHP,
      char,
      playerClass,
      setDelicia,
      stacks,
      setStacks,
      triggerExplosion,
    });

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