import { normalBehavior } from "./normal";
import { larissaBehavior } from "./larissa";

export const battleBehaviors: Record<string, any> = {
  larissa: larissaBehavior,
  default: normalBehavior,
};