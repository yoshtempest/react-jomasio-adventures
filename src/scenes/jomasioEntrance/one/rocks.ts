import type { SceneRock } from "@/gameRules/movement/rocks";

/**
 * Rochas da entrada de Jomasio.
 *
 * A rocha grande em (13,10) é a parede que o jogador minera de fora; a
 * pequena em (10,10) é escalável (leva o jogador para a altura 1) e a média
 * em (16,10) bloqueia a passagem sem poder ser escalada.
 */
export const jomasioEntranceRocks: SceneRock[] = [
  { x: 13, y: 10, size: "large" },
  { x: 10, y: 10, size: "small" },
  { x: 16, y: 10, size: "medium" },
];
