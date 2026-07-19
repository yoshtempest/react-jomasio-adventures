import { chasePlayer } from "@/gameRules/npc/movement";
import { isNear } from "@/gameRules/npc/behavior";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

const MELEE_RANGE = 50;
const GRAB_DURATION = 4000;
const GRAB_GET_DURATION = 1000;
const MELEE_COOLDOWN = 800;
const GRAB_COOLDOWN = 2000;

export function hungryDeathBehavior(ctx: BehaviorContext) {
  const { npc, targetX, targetY, onMeleeHit, onGrabPlayer, playSound } = ctx;
  const now = Date.now();

  if (!npc.ai) npc.ai = {};
  if (!npc.ai.hungryDeath) {
    npc.ai.hungryDeath = {
      grabPhase: null,
      grabStartTime: 0,
      attackCount: 0,
      lastMeleeAttack: 0,
      lastGrabEndTime: 0,
    };
  }

  const state = npc.ai.hungryDeath;

  if (state.grabPhase === "grabbing") {
    const elapsed = now - state.grabStartTime;

    if (elapsed >= GRAB_DURATION) {
      state.grabPhase = null;
      state.attackCount = 0;
      state.lastGrabEndTime = now;
      return { x: npc.x, y: npc.y, state: "walk" as const };
    }

    if (elapsed < GRAB_GET_DURATION) {
      playSound?.("hungryDeath");
      return { x: npc.x, y: npc.y, state: "get" as const };
    }

    if (now - state.lastMeleeAttack > MELEE_COOLDOWN) {
      onMeleeHit();
      playSound?.("bite");
      state.attackCount++;
      state.lastMeleeAttack = now;
      return { x: npc.x, y: npc.y, state: "meleeAttack" as const };
    }

    return { x: npc.x, y: npc.y, state: "meleeAttack" as const };
  }

  if (now - state.lastGrabEndTime < GRAB_COOLDOWN) {
    const { x } = chasePlayer(npc, targetX, targetY);
    return { x, y: npc.y };
  }

  const { x } = chasePlayer(npc, targetX, targetY);
  const inRange = isNear(npc.x, npc.y, targetX, targetY, MELEE_RANGE);

  if (inRange) {
    state.grabPhase = "grabbing";
    state.grabStartTime = now;
    state.lastMeleeAttack = now;

    onGrabPlayer?.(false);
    return { x: npc.x, y: npc.y, state: "get" as const };
  }

  return { x, y: npc.y };
}
