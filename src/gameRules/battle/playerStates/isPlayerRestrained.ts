/**
 * Jogador contido — agarrado, arremessado ou no chão. Bloqueia movimento,
 * crouch e dash.
 */
export function isPlayerRestrained(player: Player): boolean {
  if (player.grabbedUntil != null && Date.now() < player.grabbedUntil) {
    return true;
  }
  if (player.throwStartTime > 0) return true;
  if (player.state === "fallen") return true;
  return false;
}