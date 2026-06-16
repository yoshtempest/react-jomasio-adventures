import { normalBehavior } from "./normal";
import { larissaBehavior } from "./larissa";
import type { BattleBehavior } from "@/utils/types/player/behavior";

export const battleBehaviors: Record<string, BattleBehavior> = {
  larissa: larissaBehavior,
  default: normalBehavior,
};
