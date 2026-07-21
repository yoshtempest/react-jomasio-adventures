import { getNpcDirection } from "@/gameRules/battle/npc/npcPosition";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

export function dummyBehavior(ctx: BehaviorContext) {
  const { npc, playerX } = ctx;
  const direction = getNpcDirection(npc.x, playerX);
  return { x: npc.x, y: npc.y, state: "idle" as const, direction };
}
