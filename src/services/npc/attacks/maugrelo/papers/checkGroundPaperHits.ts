import {
  type MaugreloAI,
  PAPER_STEP_RADIUS,
  PAPER_STEP_VERTICAL_RANGE,
} from "../state";

/**
 * Pisar num papel **arma** o papel em vez de explodi-lo: ele fica piscando por
 * `PAPER_BLINK_DURATION` e só então `updateArmedPapers` troca para
 * explosion.svg e aplica o dano. É essa janela que permite ao jogador desarmar
 * o papel com um ataque (`checkPaperAttackHits`) antes de levar dano.
 */
export function checkGroundPaperHits(
  ai: MaugreloAI,
  playerX: number,
  playerY: number,
  onGroundPaperHit: (() => void) | undefined,
  now: number,
) {
  if (!onGroundPaperHit) return;

  const allPapers = [...ai.groundPapers, ...ai.landedPapers];

  for (const gp of allPapers) {
    if (gp.sprite === "explosion") continue;
    if (gp.armedAt != null) continue;

    const dx = Math.abs(playerX - gp.x);
    const dy = Math.abs(playerY - gp.y);

    if (dx < PAPER_STEP_RADIUS && dy <= PAPER_STEP_VERTICAL_RANGE) {
      gp.armedAt = now;
      break;
    }
  }
}
