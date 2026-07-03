import { chasePlayer } from "@/gameRules/npc/movement";
import { canAttack, isNear } from "@/gameRules/npc/behavior";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";
import { NPC_MELEE_COOLDOWN } from "@/data/cooldowns";

const MELEE_RANGE = 50;
const GET_DURATION = 1000;
const THROW_DURATION = 1000;

export function jhowsimarBehavior(ctx: BehaviorContext) {
  const { npc, targetX, targetY, lastAttackRef, onMeleeHit, playSound } = ctx;
  const now = Date.now();

  if (!npc.ai) npc.ai = {};
  if (!npc.ai.jhowsimar) {
    npc.ai.jhowsimar = { attackCount: 0, grabPhase: null, startTime: 0 };
  }

  const state = npc.ai.jhowsimar;

  if (state.grabPhase) {
    const elapsed = now - state.startTime;

    if (state.grabPhase === "get") {
      if (elapsed >= GET_DURATION) {
        state.grabPhase = "throw";
        state.startTime = now;
        return { x: npc.x, y: npc.y, state: "throw" as const };
      }
      return { x: npc.x, y: npc.y, state: "get" as const };
    }

    if (state.grabPhase === "throw") {
      if (elapsed >= THROW_DURATION) {
        state.grabPhase = null;
        ctx.onThrowPlayer?.(1.5);
        state.attackCount = 0;
      } else {
        return { x: npc.x, y: npc.y, state: "throw" as const };
      }
    }
  }

  const { x } = chasePlayer(npc, targetX, targetY);
  const inRange = isNear(npc.x, npc.y, targetX, targetY, MELEE_RANGE);
  const readyToAttack = canAttack(lastAttackRef, NPC_MELEE_COOLDOWN);

  if (inRange && readyToAttack) {
    if (state.attackCount >= 3) {
      lastAttackRef.current = now;
      state.grabPhase = "get";
      state.startTime = now;
      playSound?.("jhowsimarJooj");
      ctx.onGrabPlayer?.();
      return { x: npc.x, y: npc.y, state: "get" as const };
    }

    onMeleeHit();
    state.attackCount++;
    lastAttackRef.current = now;
  }

  return { x, y: npc.y };
}
