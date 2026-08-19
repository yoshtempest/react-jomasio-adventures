import { isNear } from "@/gameRules/npc/behavior";
import { getChaseMovement } from "@/gameRules/movement/npc";
import { NPC_RUNNING_SPEED, NPC_BASE_SPEED } from "@/utils/types/player/movement";
import type { BehaviorContext, BehaviorResult } from "@/utils/types/npc/npcBehavior";
import type { MaugreloAI } from "./state";
import {
  PRE_MOVE_DURATION,
  THROW_ACTIVE_DURATION,
  POST_ACTION_COOLDOWN,
  SLAP_RANGE,
  PUSH_RANGE,
  MELEE_SWITCH_DISTANCE,
  SLAP_COOLDOWN,
  PUSH_COOLDOWN,
  THROW_COOLDOWN,
  MAX_GROUND_PAPERS,
  MEDITATION_ARMOR_INTERVAL,
  RUN_TRANSITION_DELAY,
} from "./state";
import { spawnFlyingPaper } from "./papers";

export function handlePreMove(
  ai: MaugreloAI,
  now: number,
  npcX: number,
  npcY: number,
  playerX: number,
  playSound: BehaviorContext["playSound"],
): BehaviorResult {
  ai.walkingStartTime = 0;

  if (now - ai.actionStart >= PRE_MOVE_DURATION) {
    ai.actionState = "action";
    ai.actionStart = now;

    if (ai.currentAction === "throw") {
      spawnFlyingPaper(npcX, npcY, playerX, ai);
      playSound?.("knifeAttack");
    }
  }

  return { x: npcX, y: npcY, state: "preMove" as const };
}

export function handleAction(
  ai: MaugreloAI,
  now: number,
  npcX: number,
  npcY: number,
  onMeleeHit: BehaviorContext["onMeleeHit"],
  onPushPlayer: BehaviorContext["onPushPlayer"],
  playSound: BehaviorContext["playSound"],
): BehaviorResult | null {
  if (ai.currentAction === "throw") {
    if (now - ai.actionStart >= THROW_ACTIVE_DURATION) {
      ai.actionState = "postAction";
      ai.actionStart = now;
    }
    return { x: npcX, y: npcY, state: "throw" as const };
  }

  if (ai.currentAction === "slap") {
    onMeleeHit();
    playSound?.("knifeAttack");
    ai.actionState = "postAction";
    ai.actionStart = now;
    return { x: npcX, y: npcY, state: "slap" as const };
  }

  if (ai.currentAction === "push") {
    onPushPlayer?.(npcX);
    playSound?.("boom");
    ai.actionState = "postAction";
    ai.actionStart = now;
    return { x: npcX, y: npcY, state: "push" as const };
  }

  return null;
}

export function handlePostAction(
  ai: MaugreloAI,
  now: number,
  npcX: number,
  npcY: number,
): BehaviorResult {
  if (now - ai.actionStart >= POST_ACTION_COOLDOWN) {
    ai.actionState = "idle";
    ai.currentAction = null;
  }
  return { x: npcX, y: npcY, state: "idle" as const };
}

export function handleMeditating(
  ai: MaugreloAI,
  now: number,
  npcX: number,
  npcY: number,
  distanceX: number,
  onArmorBuff: BehaviorContext["onArmorBuff"],
): BehaviorResult {
  if (distanceX <= MELEE_SWITCH_DISTANCE) {
    ai.actionState = "preMove";
    ai.actionStart = now;
    ai.currentAction = "slap";
    ai.lastSlap = now;
    return { x: npcX, y: npcY, state: "preMove" as const };
  }

  if (now - ai.lastArmorBuff >= MEDITATION_ARMOR_INTERVAL) {
    ai.meditationArmorBonus += 1;
    ai.lastArmorBuff = now;
    onArmorBuff?.(npcX, npcY);
  }

  return { x: npcX, y: npcY, state: "meditating" as const };
}

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
    if (now - ai.lastSlap >= SLAP_COOLDOWN && now - ai.lastPush >= PUSH_COOLDOWN) {
      const preferSlap = now - ai.lastSlap <= now - ai.lastPush;

      if (preferSlap || now - ai.lastPush < PUSH_COOLDOWN) {
        if (now - ai.lastSlap >= SLAP_COOLDOWN && isNear(npcX, npcY, playerX, playerY, SLAP_RANGE)) {
          ai.actionState = "preMove";
          ai.actionStart = now;
          ai.currentAction = "slap";
          ai.lastSlap = now;
          return { x: npcX, y: npcY, state: "preMove" as const };
        }
      }

      if (!preferSlap || now - ai.lastSlap < SLAP_COOLDOWN) {
        if (now - ai.lastPush >= PUSH_COOLDOWN && isNear(npcX, npcY, playerX, playerY, PUSH_RANGE)) {
          ai.actionState = "preMove";
          ai.actionStart = now;
          ai.currentAction = "push";
          ai.lastPush = now;
          return { x: npcX, y: npcY, state: "preMove" as const };
        }
      }
    }

    const { x } = getChaseMovement(npcX, npcY, playerX, playerY);
    return { x, y: npcY };
  }

  if (ai.walkingStartTime === 0) {
    ai.walkingStartTime = now;
  }

  const isRunning = now - ai.walkingStartTime >= RUN_TRANSITION_DELAY;
  const speedMultiplier = isRunning ? NPC_RUNNING_SPEED / NPC_BASE_SPEED : 1;
  const chaseState = isRunning ? ("run" as const) : ("walk" as const);

  const { x } = getChaseMovement(npcX, npcY, playerX, playerY, speedMultiplier);
  return { x, y: npcY, state: chaseState };
}
