/**
 * Geometria do feixe de Laser da Forma Vastolord: onde o feixe começa e
 * termina em px lógicos, e onde o sprite deve ser desenhado.
 *
 * Mora em `gameRules/` (e não em `useVastolordLaser.ts`) porque tanto o hook
 * que dispara o feixe quanto o componente que o desenham precisam da mesma
 * conta — `src/components/` não deve importar nada de `src/hooks/`.
 */

import { VASTOLORD_LASER_BEAM_HEIGHT } from "@/data/characters/marshadowLaser";

/** Altura renderizada do sprite do jogador (px lógicos do plano 1000x600). */
export const VASTOLORD_PLAYER_SPRITE_RATIO = 2.5;

/** Altura do sprite do marcelo em px lógicos, dado o tamanho do tile. */
export function vastolordPlayerSpriteHeight(playerSize: number): number {
  return playerSize * VASTOLORD_PLAYER_SPRITE_RATIO;
}

/** y do topo do feixe: centralizado no sprite do marcelo. */
export function vastolordLaserTop(beamY: number, playerSize: number): number {
  const spriteHeight = vastolordPlayerSpriteHeight(playerSize);
  return beamY - spriteHeight / 2 - VASTOLORD_LASER_BEAM_HEIGHT / 2;
}

export type VastolordLaserBeam = {
  /** Limite esquerdo do feixe (px lógicos): 0 ou o x do jogador. */
  fromX: number;
  /** Limite direito do feixe (px lógicos): o x do jogador ou a largura do mapa. */
  toX: number;
  /** y do jogador no instante do disparo (pés) — centro do feixe = centro do sprite acima dele. */
  y: number;
};
