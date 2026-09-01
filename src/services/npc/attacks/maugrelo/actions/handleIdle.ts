import { isNear } from "@/gameRules/npc/behavior";
import { getChaseMovement } from "@/gameRules/movement/npc";
import {
  NPC_RUNNING_SPEED,
  NPC_BASE_SPEED,
} from "@/gameRules/movement/constants";
import type {
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import type { MaugreloAI } from "../state";
import {
  SLAP_RANGE,
  PUSH_RANGE,
  MELEE_SWITCH_DISTANCE,
  SLAP_COOLDOWN,
  PUSH_COOLDOWN,
  THROW_COOLDOWN,
  MAX_GROUND_PAPERS,
  RUN_TRANSITION_DELAY,
} from "../state";

export function handleIdle(
  ai: MaugreloAI,
  now: number,
  npcX: number,
  npcY: number,
  playerX: number,
  playerY: number,
  distanceX: number,
): BehaviorResult {
  const hasMaxPapers = ai.groundPapers.length >= MAX_GROUND_PAPERS;
  const noFlying = !ai.flyingPaper;

  if (hasMaxPapers && noFlying) {
    ai.actionState = "meditating";
    ai.lastArmorBuff = now;
    return { x: npcX, y: npcY, state: "meditating" as const };
  }

  if (distanceX > MELEE_SWITCH_DISTANCE) {
    if (noFlying && now - ai.lastThrow >= THROW_COOLDOWN) {
      ai.actionState = "preMove";
      ai.actionStart = now;
      ai.currentAction = "throw";
      ai.lastThrow = now;
      return { x: npcX, y: npcY, state: "preMove" as const };
    }
  } else {
    if (
      now - ai.lastSlap >= SLAP_COOLDOWN &&
      now - ai.lastPush >= PUSH_COOLDOWN
    ) {
      const preferSlap = now - ai.lastSlap <= now - ai.lastPush;

      if (preferSlap || now - ai.lastPush < PUSH_COOLDOWN) {
        if (
          now - ai.lastSlap >= SLAP_COOLDOWN &&
          isNear(npcX, npcY, playerX, playerY, SLAP_RANGE)
        ) {
          ai.actionState = "preMove";
          ai.actionStart = now;
          ai.currentAction = "slap";
          ai.lastSlap = now;
          return { x: npcX, y: npcY, state: "preMove" as const };
        }
      }

      if (!preferSlap || now - ai.lastSlap < SLAP_COOLDOWN) {
        if (
          now - ai.lastPush >= PUSH_COOLDOWN &&
          isNear(npcX, npcY, playerX, playerY, PUSH_RANGE)
        ) {
          ai.actionState = "preMove";
          ai.actionStart = now;
          ai.currentAction = "push";
          ai.lastPush = now;
          return { x: npcX, y: npcY, state: "preMove" as const };
        }
      }
    }

    const { x } = getChaseMovement(npcX, npcY, playerX, playerY, 1, SLAP_RANGE);
    return { x, y: npcY };
  }

  if (ai.walkingStartTime === 0) {
    ai.walkingStartTime = now;
  }

  const isRunning = now - ai.walkingStartTime >= RUN_TRANSITION_DELAY;
  const speedMultiplier = isRunning ? NPC_RUNNING_SPEED / NPC_BASE_SPEED : 1;
  const chaseState = isRunning ? ("run" as const) : ("walk" as const);

  const { x } = getChaseMovement(
    npcX,
    npcY,
    playerX,
    playerY,
    speedMultiplier,
    SLAP_RANGE,
  );
  return { x, y: npcY, state: chaseState };
}