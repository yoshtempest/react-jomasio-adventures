import { normalBehavior } from "./normal";
import { vandinhaBehavior } from "./vandinha";
import { deiseBehavior } from "./deise/index";
import { slimitaBehavior } from "./slimita/index";
import { hungryKingBehavior } from "./hungryKing/index";
import { piupiuBehavior } from "./piupiu";
import { jhowsimarBehavior } from "./jhowsimar";
import { hungryDeathBehavior } from "./hungryDeath";
import { goatBehavior } from "./goat/index";
import type { BehaviorContext, BehaviorResult } from "@/utils/types/npc/npcBehavior";

type NpcBehaviorFn = (ctx: BehaviorContext) => BehaviorResult;

export const npcBehaviors: Record<string, NpcBehaviorFn> = {
  vandinhaFragment: vandinhaBehavior,
  deise: deiseBehavior,
  slimita: slimitaBehavior,
  hungryKing: hungryKingBehavior,
  piupiu: piupiuBehavior,
  jhowsimar: jhowsimarBehavior,
  hungryDeath: hungryDeathBehavior,
  goat: goatBehavior,
  default: normalBehavior,
};
