import { normalBehavior } from "./normal";
import { vandinhaBehavior } from "./vandinha";
import { deiseBehavior } from "./deise";

export const npcBehaviors: Record<string, any> = {
  vandinhaFragment: vandinhaBehavior,
  deiseBehavior: deiseBehavior,
  default: normalBehavior,
};