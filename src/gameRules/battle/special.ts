import { SPECIAL_HITS_BY_CLASS } from "@/utils/types/player/classes";
import type { PlayerClass } from "@/utils/types/player/player";

export function getMaxSpecial(playerClass: PlayerClass | null) {
  if (playerClass === "fracote") {
    return SPECIAL_HITS_BY_CLASS.fracote;
  }

  return SPECIAL_HITS_BY_CLASS.default;
}

export function gainSpecial(current: number, max: number) {
  return Math.min(current + 1, max);
}

