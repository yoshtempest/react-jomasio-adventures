import {
  type MaugreloAI,
  PAPER_GROUND_Y,
  STUCK_PAPER_DURATION,
  STUCK_EXPLOSION_DISAPPEAR_MS,
} from "@/services/npc/attacks/maugrelo/state";

export function updateStuckPapers(
  ai: MaugreloAI,
  playerState: PlayerState,
  playerX: number,
  now: number,
  onStuckPaperExplode: (() => void) | undefined,
) {
  if (ai.stuckPapers.length === 0) return;

  if (playerState === "dash") {
    for (const sp of ai.stuckPapers) {
      ai.landedPapers.push({
        id: sp.id,
        x: playerX,
        y: PAPER_GROUND_Y,
        sprite: "paper",
        createdAt: now,
      });
    }
    ai.stuckPapers = [];
    return;
  }

  let exploded = false;

  ai.stuckPapers = ai.stuckPapers.filter((sp) => {
    if (!sp.explodeAt) {
      if (now - sp.stuckAt >= STUCK_PAPER_DURATION) {
        // começa a explodir agora → troca para explosion.svg
        sp.explodeAt = now;
        exploded = true;
      }
      return true;
    }

    // já está explodindo → some após o fade-out
    return now - sp.explodeAt < STUCK_EXPLOSION_DISAPPEAR_MS;
  });

  if (exploded) {
    onStuckPaperExplode?.();
  }
}
