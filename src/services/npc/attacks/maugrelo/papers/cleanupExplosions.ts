import {
  type MaugreloAI,
  PAPER_EXPLOSION_DURATION,
} from "@/services/npc/attacks/maugrelo/state";

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
  ai.landedPapers = ai.landedPapers.filter((gp) => {
    if (
      gp.sprite === "explosion" &&
      now - gp.createdAt >= PAPER_EXPLOSION_DURATION
    ) {
      return false;
    }
    return true;
  });
}
