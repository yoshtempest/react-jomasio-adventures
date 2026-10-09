import {
  type MaugreloAI,
  PAPER_ATTACK_RANGE,
} from "@/services/npc/attacks/maugrelo/state";

export function checkPaperAttackHits(
  ai: MaugreloAI,
  playerX: number,
  playerState: PlayerState,
  playerDirection: Direction,
  onPaperExplode: (() => void) | undefined,
  now: number,
) {
  if (playerState !== "attack") return;

  const allPapers = [...ai.groundPapers, ...ai.landedPapers];

  for (const gp of allPapers) {
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
