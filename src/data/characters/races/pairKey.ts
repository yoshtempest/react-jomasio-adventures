import type { Race } from "@/utils/types/character/race";

export function pairKey(a: Race, b: Race): string {
  return a <= b ? `${a},${b}` : `${b},${a}`;
}