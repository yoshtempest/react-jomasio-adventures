import type { MaugreloAI } from "./state";
import {
  PAPER_GRAVITY,
  PAPER_INITIAL_VEL_Y,
  PAPER_GROUND_Y,
  PAPER_GROUND_Y_SPREAD,
  PAPER_X_SPREAD,
  PAPER_VEL_X_SPREAD,
  PAPER_MIN_DISTANCE,
  PAPER_EXPLOSION_DURATION,
  PAPER_STEP_RADIUS,
  PAPER_STEP_VERTICAL_RANGE,
  PAPER_ATTACK_RANGE,
} from "./state";

export function spawnFlyingPaper(
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

export function updateFlyingPaper(ai: MaugreloAI) {
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
        const angle =
          Math.atan2(landY - gp.y, landX - gp.x) || Math.random() * Math.PI * 2;
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

export function cleanupExplosions(ai: MaugreloAI, now: number) {
  ai.groundPapers = ai.groundPapers.filter((gp) => {
    if (
      gp.sprite === "explosion" &&
      now - gp.createdAt >= PAPER_EXPLOSION_DURATION
    ) {
      return false;
    }
    return true;
  });
}

export function checkGroundPaperHits(
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

    if (dx < PAPER_STEP_RADIUS && dy <= PAPER_STEP_VERTICAL_RANGE) {
      gp.sprite = "explosion";
      gp.createdAt = now;
      ai.lastPaperHitId = gp.id;
      onGroundPaperHit();
      break;
    }
  }
}

export function checkPaperAttackHits(
  ai: MaugreloAI,
  playerX: number,
  playerState: PlayerState,
  playerDirection: Direction,
  onPaperExplode: (() => void) | undefined,
  now: number,
) {
  if (playerState !== "attack") return;

  for (const gp of ai.groundPapers) {
    if (gp.sprite !== "paper") continue;
    if (gp.id === ai.lastPaperHitId) continue;

    const inRange = Math.abs(playerX - gp.x) < PAPER_ATTACK_RANGE;
    const facing =
      playerDirection === "right" ? gp.x > playerX : gp.x < playerX;

    if (inRange && facing) {
      gp.sprite = "explosion";
      gp.createdAt = now;
      ai.lastPaperHitId = gp.id;
      onPaperExplode?.();
      break;
    }
  }
}
