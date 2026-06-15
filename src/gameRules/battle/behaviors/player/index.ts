import { normalBehavior } from "./normal";
import { larissaBehavior } from "./larissa";
import type { BattleBehavior } from "@/utils/types/player/playerBehavior";

export const battleBehaviors: Record<string, BattleBehavior> = {
  larissa: larissaBehavior,
  default: normalBehavior,
};
