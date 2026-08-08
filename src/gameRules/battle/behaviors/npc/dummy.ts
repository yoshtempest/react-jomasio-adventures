import { normalBehavior } from "./normal";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

export function dummyBehavior(ctx: BehaviorContext) {
  return normalBehavior(ctx);
}
