import { isNear } from "@/gameRules/npc/behavior";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
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
  PAPER_GRAVITY,
  PAPER_INITIAL_VEL_Y,
  PAPER_GROUND_Y,
  PAPER_EXPLOSION_DURATION,
  PAPER_STEP_RADIUS,
} from "./state";

export function maugreloPhase1(
  ctx: BehaviorContext,
  ai: MaugreloAI,
): BehaviorResult {
  const now = Date.now();
  const { npc, playerX, playerY, onMeleeHit, onPushPlayer, onGroundPaperHit } =
    ctx;

  const distanceX = Math.abs(npc.x - playerX);

  updateFlyingPaper(ai);
  cleanupExplosions(ai, now);
  checkGroundPaperHits(ai, playerX, playerY, onGroundPaperHit, now);

  if (ai.actionState === "preMove") {
    if (now - ai.actionStart >= PRE_MOVE_DURATION) {
      ai.actionState = "action";
      ai.actionStart = now;

      if (ai.currentAction === "throw") {
        spawnFlyingPaper(npc.x, npc.y, playerX, ai);
        ctx.playSound?.("knifeAttack");
      }
    }

    return { x: npc.x, y: npc.y, state: "preMove" as const };
  }

  if (ai.actionState === "action") {
    if (ai.currentAction === "throw") {
      if (now - ai.actionStart >= THROW_ACTIVE_DURATION) {
        ai.actionState = "postAction";
        ai.actionStart = now;
      }
      return { x: npc.x, y: npc.y, state: "throw" as const };
    }

    if (ai.currentAction === "slap") {
      onMeleeHit();
      ctx.playSound?.("knifeAttack");
      ai.actionState = "postAction";
      ai.actionStart = now;
      return { x: npc.x, y: npc.y, state: "slap" as const };
    }

    if (ai.currentAction === "push") {
      onPushPlayer?.(npc.x);
      ctx.playSound?.("boom");
      ai.actionState = "postAction";
      ai.actionStart = now;
      return { x: npc.x, y: npc.y, state: "push" as const };
    }
  }

  if (ai.actionState === "postAction") {
    if (now - ai.actionStart >= POST_ACTION_COOLDOWN) {
      ai.actionState = "idle";
      ai.currentAction = null;
    }
    return { x: npc.x, y: npc.y, state: "idle" as const };
  }

  if (ai.actionState === "idle") {
    if (distanceX > MELEE_SWITCH_DISTANCE) {
      if (
        !ai.flyingPaper &&
        now - ai.lastThrow >= THROW_COOLDOWN
      ) {
        ai.actionState = "preMove";
        ai.actionStart = now;
        ai.currentAction = "throw";
        ai.lastThrow = now;
        return { x: npc.x, y: npc.y, state: "preMove" as const };
      }
    } else {
      if (now - ai.lastSlap >= SLAP_COOLDOWN && now - ai.lastPush >= PUSH_COOLDOWN) {
        const preferSlap = now - ai.lastSlap <= now - ai.lastPush;

        if (preferSlap || now - ai.lastPush < PUSH_COOLDOWN) {
          if (now - ai.lastSlap >= SLAP_COOLDOWN && isNear(npc.x, npc.y, playerX, playerY, SLAP_RANGE)) {
            ai.actionState = "preMove";
            ai.actionStart = now;
            ai.currentAction = "slap";
            ai.lastSlap = now;
            return { x: npc.x, y: npc.y, state: "preMove" as const };
          }
        }

        if (!preferSlap || now - ai.lastSlap < SLAP_COOLDOWN) {
          if (now - ai.lastPush >= PUSH_COOLDOWN && isNear(npc.x, npc.y, playerX, playerY, PUSH_RANGE)) {
            ai.actionState = "preMove";
            ai.actionStart = now;
            ai.currentAction = "push";
            ai.lastPush = now;
            return { x: npc.x, y: npc.y, state: "preMove" as const };
          }
        }
      }
    }
  }

  return { x: npc.x, y: npc.y };
}

function spawnFlyingPaper(
  npcX: number,
  npcY: number,
  playerX: number,
  ai: MaugreloAI,
) {
  const dirX = playerX > npcX ? 1 : -1;

  ai.flyingPaper = {
    x: npcX,
    y: npcY - 80,
    velX: dirX * 2.5,
    velY: PAPER_INITIAL_VEL_Y,
  };
}

function updateFlyingPaper(ai: MaugreloAI) {
  if (!ai.flyingPaper) return;

  const p = ai.flyingPaper;
  p.velY += PAPER_GRAVITY;
  p.x += p.velX;
  p.y += p.velY;

  if (p.y >= PAPER_GROUND_Y) {
    ai.groundPapers.push({
      id: ai.paperIdCounter++,
      x: p.x,
      y: PAPER_GROUND_Y,
      sprite: "paper",
      createdAt: Date.now(),
    });
    ai.flyingPaper = null;
  }
}

function cleanupExplosions(ai: MaugreloAI, now: number) {
  ai.groundPapers = ai.groundPapers.filter((gp) => {
    if (gp.sprite === "explosion" && now - gp.createdAt >= PAPER_EXPLOSION_DURATION) {
      return false;
    }
    return true;
  });
}

function checkGroundPaperHits(
  ai: MaugreloAI,
  playerX: number,
  playerY: number,
  onGroundPaperHit: (() => void) | undefined,
  now: number,
) {
  if (!onGroundPaperHit) return;

  for (const gp of ai.groundPapers) {
    if (gp.sprite === "explosion") continue;
    if (gp.id === ai.lastPaperHitId) continue;

    const dx = Math.abs(playerX - gp.x);
    const dy = Math.abs(playerY - gp.y);

    if (dx < PAPER_STEP_RADIUS && dy <= 120) {
      gp.sprite = "explosion";
      gp.createdAt = now;
      ai.lastPaperHitId = gp.id;
      onGroundPaperHit();
      break;
    }
  }
}
