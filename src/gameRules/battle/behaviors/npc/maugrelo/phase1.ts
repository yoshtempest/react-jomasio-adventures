import { isNear } from "@/gameRules/npc/behavior";
import { chasePlayer } from "@/gameRules/npc/movement";
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
  MAX_GROUND_PAPERS,
  MEDITATION_ARMOR_INTERVAL,
  PAPER_GRAVITY,
  PAPER_INITIAL_VEL_Y,
  PAPER_GROUND_Y,
  PAPER_GROUND_Y_SPREAD,
  PAPER_X_SPREAD,
  PAPER_VEL_X_SPREAD,
  PAPER_MIN_DISTANCE,
  PAPER_EXPLOSION_DURATION,
  PAPER_STEP_RADIUS,
} from "./state";

export function maugreloPhase1(
  ctx: BehaviorContext,
  ai: MaugreloAI,
): BehaviorResult {
  const now = Date.now();
  const { npc, playerX, playerY, onMeleeHit, onPushPlayer, onGroundPaperHit, onArmorBuff } =
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

  if (ai.actionState === "meditating") {
    if (distanceX <= MELEE_SWITCH_DISTANCE) {
      enterInterruptSlap(ai, now);
      return { x: npc.x, y: npc.y, state: "preMove" as const };
    }

    if (now - ai.lastArmorBuff >= MEDITATION_ARMOR_INTERVAL) {
      ai.meditationArmorBonus += 1;
      ai.lastArmorBuff = now;
      onArmorBuff?.();
    }

    return { x: npc.x, y: npc.y, state: "meditating" as const };
  }

  if (ai.actionState === "idle") {
    const hasMaxPapers = ai.groundPapers.length >= MAX_GROUND_PAPERS;
    const noFlying = !ai.flyingPaper;

    if (hasMaxPapers && noFlying) {
      ai.actionState = "meditating";
      ai.lastArmorBuff = now;
      return { x: npc.x, y: npc.y, state: "meditating" as const };
    }

    if (distanceX > MELEE_SWITCH_DISTANCE) {
      if (noFlying && now - ai.lastThrow >= THROW_COOLDOWN) {
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

      const { x } = chasePlayer(npc, playerX, playerY);
      return { x, y: npc.y };
    }

    const { x } = chasePlayer(npc, playerX, playerY);
    return { x, y: npc.y };
  }

  return { x: npc.x, y: npc.y };
}

function enterInterruptSlap(ai: MaugreloAI, now: number) {
  ai.actionState = "preMove";
  ai.actionStart = now;
  ai.currentAction = "slap";
  ai.lastSlap = now;
}

function spawnFlyingPaper(
  npcX: number,
  npcY: number,
  playerX: number,
  ai: MaugreloAI,
) {
  const dirX = playerX > npcX ? 1 : -1;
  const xOffset = (Math.random() - 0.5) * PAPER_X_SPREAD;
  const velXOffset = (Math.random() - 0.5) * PAPER_VEL_X_SPREAD;

  ai.flyingPaper = {
    x: npcX + xOffset,
    y: npcY - 80,
    velX: dirX * (2.5 + velXOffset),
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
    let landX = p.x;
    const baseGroundY = PAPER_GROUND_Y;
    const groundYSpread = (Math.random() - 0.5) * PAPER_GROUND_Y_SPREAD;
    let landY = baseGroundY + groundYSpread;

    for (const gp of ai.groundPapers) {
      const dx = Math.abs(landX - gp.x);
      const dy = Math.abs(landY - gp.y);
      const dist = Math.hypot(dx, dy);

      if (dist < PAPER_MIN_DISTANCE) {
        const angle = Math.atan2(landY - gp.y, landX - gp.x) || Math.random() * Math.PI * 2;
        landX = gp.x + Math.cos(angle) * PAPER_MIN_DISTANCE;
        landY = gp.y + Math.sin(angle) * PAPER_MIN_DISTANCE;
      }
    }

    ai.groundPapers.push({
      id: ai.paperIdCounter++,
      x: landX,
      y: landY,
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
