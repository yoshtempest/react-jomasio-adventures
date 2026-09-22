import { clampX } from "../clampX";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import {
  FLEE_MS,
  type HungryDogAI,
} from "../state";
import { rechargeSpecial } from "../rechargeSpecial";

const FLEE_STEP = 7;
const FLEE_HOP_MS = 500;
const FLEE_HOP_HEIGHT = 40;

export function handleFlee(
    ctx: BehaviorContext,
    ai: HungryDogAI,
    now: number,
  ): BehaviorResult {
    const { npc, playerX } = ctx;
    const elapsed = now - ai.phaseStart;

    rechargeSpecial(ai, now);

    const dirAway = npc.x >= playerX ? 1 : -1;
    const nextX = clampX(npc.x + dirAway * FLEE_STEP);

    const hop =
      elapsed < FLEE_HOP_MS
        ? -Math.sin((elapsed / FLEE_HOP_MS) * Math.PI) * FLEE_HOP_HEIGHT
        : 0;

    if (elapsed >= FLEE_MS) {
      ai.phase = "chase";
      ai.phaseStart = now;
      // Ancora no chão (emergeBaseY): npc.y já pode estar elevado do pulo
      // anterior e, se propagado, o alfa sobe sem nunca voltar.
      return { x: nextX, y: ai.emergeBaseY, state: "walk" };
    }

    // hop relativo ao chão — nunca a npc.y, para o pulo não acumular y.
    return { x: nextX, y: ai.emergeBaseY + hop, state: "run" };
  }