import {
  type MaugreloAI,
  PAPER_BLINK_DURATION,
  PAPER_STEP_RADIUS,
  PAPER_STEP_VERTICAL_RANGE,
} from "../state";

/**
 * Fecha o ciclo do papel armado: terminada a piscada, o papel vira
 * explosion.svg. O dano só sai se o jogador ainda estiver em cima do papel no
 * instante da explosão — sair de perto é a segunda forma de escapar, ao lado
 * de desarmar o papel com um ataque. Papel desarmado a tempo já está com
 * `sprite === "explosion"` e não chega aqui.
 */
export function updateArmedPapers(
  ai: MaugreloAI,
  playerX: number,
  playerY: number,
  onGroundPaperHit: (() => void) | undefined,
  now: number,
) {
  const allPapers = [...ai.groundPapers, ...ai.landedPapers];

  for (const gp of allPapers) {
    if (gp.sprite !== "paper") continue;
    if (gp.armedAt == null) continue;
    if (now - gp.armedAt < PAPER_BLINK_DURATION) continue;

    gp.sprite = "explosion";
    gp.createdAt = now;
    ai.lastPaperHitId = gp.id;

    const dx = Math.abs(playerX - gp.x);
    const dy = Math.abs(playerY - gp.y);

    if (dx < PAPER_STEP_RADIUS && dy <= PAPER_STEP_VERTICAL_RANGE) {
      onGroundPaperHit?.();
    }
  }
}
