import { NpcAttack } from "../npcAttack";
import { NPC_MELEE_COOLDOWN } from "@/data/cooldowns";
import { chasePlayer } from "@/gameRules/npc/movement";
import { canAttack, isNear } from "@/gameRules/npc/behavior";
import { ONE_THOUSAND_MS, THREE_HUNDRED_MS } from "@/data/ms";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";

const MELEE_RANGE = 50;
const GET_DURATION = ONE_THOUSAND_MS;
const THROW_DURATION = ONE_THOUSAND_MS;
const MELEE_VISUAL_DURATION = THREE_HUNDRED_MS;

export class JhowsimarAttack extends NpcAttack {
  constructor() {
    super("jhowsimar");
  }

  execute(ctx: BehaviorContext): BehaviorResult {
    const { npc, targetX, targetY, lastAttackRef, onMeleeHit, playSound } = ctx;
    const now = Date.now();
    const distanceX = Math.abs(npc.x - targetX);

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
          ctx.onThrowStart?.(npc.x, npc.direction);
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

    const { x } = chasePlayer(npc, targetX, targetY, 1, MELEE_RANGE);
    const inRange = isNear(npc.x, npc.y, targetX, targetY, MELEE_RANGE);
    const readyToAttack = canAttack(lastAttackRef, NPC_MELEE_COOLDOWN);

    if (inRange && readyToAttack) {
      if (state.attackCount >= 3) {
        lastAttackRef.current = now;
        state.grabPhase = "get";
        state.startTime = now;
        playSound?.("jhowsimarJooj");
        ctx.onGrabPlayer?.(true);
        return { x: npc.x, y: npc.y, state: "get" as const };
      }

      onMeleeHit();
      state.attackCount++;
      lastAttackRef.current = now;
      return { x: npc.x, y: npc.y, state: "meleeAttack" as const };
    }

    if (
      !state.grabPhase &&
      inRange &&
      now - lastAttackRef.current < MELEE_VISUAL_DURATION
    ) {
      return { x: npc.x, y: npc.y, state: "meleeAttack" as const };
    }

    if (distanceX <= MELEE_RANGE) {
      return { x: npc.x, y: npc.y };
    }

    return { x, y: npc.y };
  }
}
