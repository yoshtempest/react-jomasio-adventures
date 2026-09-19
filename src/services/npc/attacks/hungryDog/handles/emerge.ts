import { clampX } from "../clampX";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import {
  EMERGE_HOP_HEIGHT,
  EMERGE_LEAP_MS,
  type HungryDogAI,
} from "../state";

export function handleEmerge(
    ctx: BehaviorContext,
    ai: HungryDogAI,
    now: number,
  ): BehaviorResult {
    const { playerX } = ctx;
    const elapsed = now - ai.phaseStart;
    const progress = Math.min(elapsed / EMERGE_LEAP_MS, 1);
    const eased = 1 - (1 - progress) * (1 - progress);

    const fromX = ai.emergeFromX;
    const endX = clampX(playerX);
    const x = fromX + (endX - fromX) * eased;
    const y = ai.emergeBaseY - Math.sin(progress * Math.PI) * EMERGE_HOP_HEIGHT;

    if (progress >= 1) {
      const parrying = ctx.isPlayerParrying?.() ?? false;

      if (!parrying) {
        ctx.onDragPlayer?.(x, y);
      }

      ai.phase = "flee";
      ai.phaseStart = now;
      // A recarga do special (1%/100ms) só conta a partir da fuga; o tempo
      // cavando/submerso não acumula.
      ai.lastRecharge = now;
      return { x, y: ai.emergeBaseY, state: "run", hidden: false };
    }

    return { x, y, state: "jumping", hidden: false };
  }