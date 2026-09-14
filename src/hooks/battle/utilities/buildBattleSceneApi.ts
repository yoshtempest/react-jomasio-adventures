import type { BattleSceneApi } from "@/utils/types/battle/scene";

export function buildBattleSceneApi<T extends BattleSceneApi>(input: T): T {
  return input;
}
