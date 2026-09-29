import { canAct } from "@/gameRules/movement/battle/can/act";
import { BATTLE_LIMITS } from "@/gameRules/movement/constants";
import { moveAxis } from "./axis";
import { getStep } from "./getStep";

export function moveRightBattle(player: Player, canRun = true): Player {
  if (!canAct(player)) return player;
  return moveAxis(player, "right", getStep(player), BATTLE_LIMITS.maxX, {
    canRun,
  });
}
