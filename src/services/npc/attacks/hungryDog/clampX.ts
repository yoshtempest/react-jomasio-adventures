import { BATTLE_LIMITS } from "@/gameRules/movement/constants";

export function clampX(x: number): number {
  return Math.max(BATTLE_LIMITS.minX, Math.min(BATTLE_LIMITS.maxX, x));
}