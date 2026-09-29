import type { BattleSceneApi } from "@/scenes/shared/types";

export function buildBattleSceneApi<T extends BattleSceneApi>(input: T): T {
  return input;
}
