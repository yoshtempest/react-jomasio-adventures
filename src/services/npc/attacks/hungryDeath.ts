import { NpcAttack } from "../npcAttack";
import { chasePlayer } from "@/gameRules/npc/movement";
import { isNear } from "@/gameRules/npc/behavior";
import {
  EIGHT_HUNDRED_MS,
  ONE_THOUSAND_MS,
  TWO_THOUSAND_MS,
  FOUR_THOUSAND_MS,
} from "@/data/ms";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";

const MELEE_RANGE = 50;
const RUN_THRESHOLD = 150;
const RUN_SPEED_MULTIPLIER = 1.3;
const GRAB_DURATION = FOUR_THOUSAND_MS;
const GRAB_GET_DURATION = ONE_THOUSAND_MS;
const MELEE_COOLDOWN = EIGHT_HUNDRED_MS;
const GRAB_COOLDOWN = TWO_THOUSAND_MS;

function chase(
  npc: BehaviorContext["npc"],
  targetX: number,
  targetY: number,
): { x: number; state: "run" | "walk" } {
  const distanceX = Math.abs(npc.x - targetX);
  const running = distanceX > RUN_THRESHOLD;
  const { x } = chasePlayer(
    npc,
    targetX,
    targetY,
    running ? RUN_SPEED_MULTIPLIER : 1,
    MELEE_RANGE,
  );
  return { x, state: running ? "run" : "walk" };
}

export class HungryDeathAttack extends NpcAttack {
  constructor() {
    super("hungryDeath");
  }

  execute(ctx: BehaviorContext): BehaviorResult {
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
      const { x, state: runState } = chase(npc, targetX, targetY);
      return { x, y: npc.y, state: runState };
    }

    const { x, state: runState } = chase(npc, targetX, targetY);
    const inRange = isNear(npc.x, npc.y, targetX, targetY, MELEE_RANGE);

    if (inRange) {
      state.grabPhase = "grabbing";
      state.grabStartTime = now;
      state.lastMeleeAttack = now;

      onGrabPlayer?.(false);
      return { x: npc.x, y: npc.y, state: "get" as const };
    }

    return { x, y: npc.y, state: runState };
  }
}
