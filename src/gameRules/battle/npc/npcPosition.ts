import type { NPCDirection } from "@/utils/types/npc/npc";
import type { BattleObstacle } from "@/utils/types/maps/battle";
import { isHorizontallyBlocked } from "@/gameRules/battle/obstacles";

export function getNpcDirection(npcX: number, playerX: number): NPCDirection {
  return playerX < npcX ? "left" : "right";
}

export function getNpcState(
  _distanceX: number,
  forceIdle: boolean,
): "idle" | "walk" {
  if (forceIdle) return "idle";
  return "walk";
}

/**
 * A caixa do NPC em volta do ponto de pés (mesmas constantes de sempre).
 * `isHorizontallyBlocked` é, na prática, o teste de sobreposição com sólidos —
 * `platform` ficam de fora, então NPC atravessa plataforma por cima.
 */
function collides(x: number, y: number, obstacles: BattleObstacle[]): boolean {
  if (obstacles.length === 0) return false;
  return isHorizontallyBlocked(x - 15, y - 50, x + 15, y, obstacles);
}

/**
 * Colisão separada por eixo. Antes os dois branches devolviam a mesma coisa —
 * a função era um no-op e o NPC atravessava obstáculo sólido. Agora cada eixo
 * só é travado se o movimento **nele** for o que causa a sobreposição, então
 * escorregar numa parede ainda deixa o NPC continuar andando na direção paralela.
 *
 * `prev` é obrigatório para isso: sem a posição anterior não dá para saber se
 * o bloqueio veio do eixo X ou do eixo Y.
 */
export function applyObstacleCollision(
  prevX: number,
  prevY: number,
  nextX: number,
  nextY: number,
  obstacles: BattleObstacle[],
): { x: number; y: number } {
  if (obstacles.length === 0) return { x: nextX, y: nextY };
  if (!collides(nextX, nextY, obstacles)) return { x: nextX, y: nextY };
  // Spawn/teleporte já dentro do sólido: deixa andar em vez de congelar —
  // o NPC precisa poder sair de onde nasceu.
  if (collides(prevX, prevY, obstacles)) return { x: nextX, y: nextY };

  const xFree = !collides(nextX, prevY, obstacles);
  const yFree = !collides(prevX, nextY, obstacles);
  return { x: xFree ? nextX : prevX, y: yFree ? nextY : prevY };
}
