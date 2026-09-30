import {
  type MaugreloAI,
  PAPER_GRAVITY,
  PAPER_GROUND_Y,
  PAPER_GROUND_Y_SPREAD,
  PAPER_MIN_DISTANCE,
} from "@/services/npc/attacks/maugrelo/state";

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
