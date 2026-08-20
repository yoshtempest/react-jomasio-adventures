import { DIALOGUE_SPEED_LIST } from "@/utils/settings";

export const DIFFICULTY: NpcDifficulty[] = ["easy", "medium", "hard"];
export const COLUMN_COUNT = 5;
export const BOTTOM_COUNT = 5;
export const BATTLE_COUNT = 4;

export function getColumnMaxIndex(column: number): number {
  if (column === 0) return DIFFICULTY.length;
  if (column === 1) return DIALOGUE_SPEED_LIST.length;
  if (column === 2) return BOTTOM_COUNT;
  return 1;
}
