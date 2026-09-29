/**
 * Tuning do feixe de Laser da Forma Vastolord do marcelo.
 *
 * Mora em `data/` (e não em `useVastolordLaser.ts`) porque o componente que
 * desenha o feixe precisa da altura do sprite: `src/components/` não deve
 * importar nada de `src/hooks/`.
 */

import { THREE_THOUSAND_MS } from "@/data/ms";

/** Duração total do feixe (3s) — o marcelo fica travado no sprite laser.svg. */
export const VASTOLORD_LASER_DURATION_MS = THREE_THOUSAND_MS;
/** Intervalo de dano/empurrão: 1% do dano base a cada 20ms de contato. */
export const VASTOLORD_LASER_TICK_MS = 1;
/** Fração do dano base aplicada por tick (1%). */
export const VASTOLORD_LASER_DAMAGE_RATIO = 0.01;
/** Distância (px no plano lógico) que o feixe empurra o inimigo por tick. */
export const VASTOLORD_LASER_PUSH_PX = 10;
/** Altura do sprite vastolordLaser.svg (1000x243) em px lógicos. */
export const VASTOLORD_LASER_BEAM_HEIGHT = 243;
/**
 * Stacks iniciais de Laser ao entrar na Forma Vastolord: cada inimigo
 * derrotado (incluindo minions) durante a forma adiciona +1 stack.
 */
export const VASTOLORD_LASER_START_STACKS = 1;
