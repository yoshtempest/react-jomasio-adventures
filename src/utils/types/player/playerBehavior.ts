import type { PlayerClass } from "@/utils/types/player/player";
import type { CharacterProgress } from "@/contexts/CharacterProgressContext";

export type BattleBehavior = {
  onBasicHit: (data: {
    damage: number;
    setNpcHP: React.Dispatch<React.SetStateAction<number>>;
    setStacks: React.Dispatch<React.SetStateAction<number>>;
    setDelicia: React.Dispatch<React.SetStateAction<number>>;
    HITS_TO_SPECIAL: number;

    char: CharacterProgress;
    playerClass: PlayerClass;

    spawnPiercing?: () => void;
    titleDamageBonus?: number;
  }) => void;

  onSpecialHit: (data: {
    damage: number;
    stacks: number;
    setNpcHP: React.Dispatch<React.SetStateAction<number>>;
    setStacks: React.Dispatch<React.SetStateAction<number>>;
    setDelicia: React.Dispatch<React.SetStateAction<number>>;

    char: CharacterProgress;
    playerClass: PlayerClass;

    triggerExplosion?: () => void;
  }) => void;

  reset?: (data: {
    setStacks: React.Dispatch<React.SetStateAction<number>>;
    setDelicia: React.Dispatch<React.SetStateAction<number>>;
  }) => void;
};