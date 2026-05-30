import { normalBehavior } from "./normal";
import { vandinhaBehavior } from "./vandinha";
import { deiseBehavior } from "./deise";
import { slimitaBehavior } from "./slimita";

export const npcBehaviors: Record<string, any> = {
  vandinhaFragment: vandinhaBehavior,
  deise: deiseBehavior,
  slimita: slimitaBehavior,
  default: normalBehavior,
};