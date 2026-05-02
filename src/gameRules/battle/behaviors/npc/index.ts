import { normalBehavior } from "./normal";
import { vandinhaBehavior } from "./vandinha";

export const npcBehaviors: Record<string, any> = {
  vandinhaFragment: vandinhaBehavior,
  default: normalBehavior,
};