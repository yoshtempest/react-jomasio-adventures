import { normalBehavior } from "./normal";
import { vandinhaBehavior } from "./vandinha";
import { deiseBehavior } from "./deise";

export const npcBehaviors: Record<string, any> = {
  vandinhaFragment: vandinhaBehavior,
  deise: deiseBehavior,
  default: normalBehavior,
};