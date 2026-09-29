import { BATTLE_LIMITS } from "@/gameRules/movement/constants";
import { canAct } from "@/gameRules/movement/battle/can/act";
import { getStep } from "./getStep";
import { moveAxis } from "./axis";

export function moveLeftBattle(player: Player, canRun = true): Player {
  if (!canAct(player)) return player;
  return moveAxis(player, "left", getStep(player), BATTLE_LIMITS.minX, {
    canRun,
  });
}
