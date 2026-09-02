import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import type { MaugreloAI } from "../state";
import { PHASE2_DEBUFF_DURATION } from "../state";
import { STATUS_LIST } from "@/gameRules/battle/status/statusEffects";
import type { NewPlayerStatus } from "@/gameRules/battle/status/statusEffects";

const DEBUFF_STATUSES = STATUS_LIST.filter(
  (s) => s !== "bleed",
) as NewPlayerStatus[];

export function handleDebuff(
  ai: MaugreloAI,
  ctx: BehaviorContext,
  now: number,
): BehaviorResult {
  const { npc } = ctx;

  if (!ai.appliedDebuff) {
    const status =
      DEBUFF_STATUSES[Math.floor(Math.random() * DEBUFF_STATUSES.length)] ??
      "poison";
    ai.appliedDebuff = status;
    ctx.onApplyDebuff?.(status);
  }

  if (now - ai.phase2StageStart >= PHASE2_DEBUFF_DURATION) {
    ai.phase2State = "throwPapers";
    ai.phase2StageStart = now;
    ai.papersThrownCount = 0;
    ai.lastPaperThrow = 0;
    return { x: npc.x, y: ai.riseStartY, state: "throwPapers" };
  }

  return { x: npc.x, y: ai.riseStartY, state: "debuff" };
}
