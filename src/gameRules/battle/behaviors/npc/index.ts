import { normalBehavior } from "./normal";
import { vandinhaBehavior } from "./vandinha";
import { deiseBehavior } from "./deise/index";
import { slimitaBehavior } from "./slimita";
import { hungryKingBehavior } from "./hungryKing/index";
import { piupiuBehavior } from "./piupiu";
import { jhowsimarBehavior } from "./jhowsimar";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";
import type { NPCBattleState } from "@/utils/types/npc/npc";

type NpcBehaviorFn = (ctx: BehaviorContext) => { x: number; y?: number; state?: NPCBattleState["state"] };

export const npcBehaviors: Record<string, NpcBehaviorFn> = {
  vandinhaFragment: vandinhaBehavior,
  deise: deiseBehavior,
  slimita: slimitaBehavior,
  hungryKing: hungryKingBehavior,
  piupiu: piupiuBehavior,
  jhowsimar: jhowsimarBehavior,
  default: normalBehavior,
};
