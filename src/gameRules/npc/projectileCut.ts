import { ProjectileConstants } from "@/data/projectile";
import { isPlayerInRange } from "@/gameRules/battle/range";
import { isFacingTarget } from "@/gameRules/battle/direction";

/** Chance de 10% do Marshadow cortar um projétil com o ataque normal. */
export const MARSHADOW_CUT_CHANCE = 0.1;

/** boolean marcado como "marshadow" (characterId "marcelo"). */
export const MARSHADOW_CHARACTER_ID = "marcelo";

/** Velocidade dos fragmentos depois do corte. */
export const PROJECTILE_CUT_SPEED = 17;

/**
 * Direções dos fragmentos após o corte (coordenadas de tela, +y para baixo).
 *
 * - Superior: sobe para a esquerda (~135° no sentido trigonométrico)
 * - Inferior: desce para a esquerda (~225°)
 */
export const PROJECTILE_CUT_DIRECTIONS = {
  upper: { x: -Math.SQRT1_2, y: -Math.SQRT1_2 },
  lower: { x: -Math.SQRT1_2, y: Math.SQRT1_2 },
} as const;

type CutParams = {
  projectile: ProjectileCommon | ProjectilePull;
  playerX: number;
  playerY: number;
  playerState: PlayerState;
  playerCharacter: string;
  playerDirection: Direction;
  npcClass: NPCClass;
};

/**
 * Decide se um projétil deve ser cortado.
 *
 * Condições: o jogador é o Marshadow, está atacando (state "attack"), o
 * projétil está dentro do alcance do ataque normal e frente ao jogador, e o
 * roll de 10% passa.
 */
export function shouldCutProjectile({
  projectile,
  playerX,
  playerY,
  playerState,
  playerCharacter,
  playerDirection,
  npcClass,
}: CutParams): boolean {
  if (playerCharacter !== MARSHADOW_CHARACTER_ID) return false;
  if (playerState !== "attack") return false;

  const inRange = isPlayerInRange(
    playerX,
    playerY,
    projectile.x,
    projectile.y,
    playerState,
    playerCharacter,
    false,
    false,
    npcClass,
  );
  if (!inRange) return false;

  const facing = isFacingTarget(
    playerX,
    playerY,
    projectile.x,
    projectile.y,
    playerDirection,
    npcClass,
  );
  if (!facing) return false;

  return Math.random() < MARSHADOW_CUT_CHANCE;
}

/** Converte um projétil linear em um projétil cortado com as duas partes. */
export function createSlicedProjectile(
  p: ProjectileCommon | ProjectilePull,
  x = p.x,
  y = p.y,
): ProjectileCut {
  const { upper, lower } = PROJECTILE_CUT_DIRECTIONS;

  return {
    variant: "cut",
    x,
    y,
    startX: p.startX,
    startY: p.startY,
    sprite: p.sprite,
    createdAt: Date.now(),
    state: "idle",
    upper: { x, y },
    lower: { x, y },
    upperDirX: upper.x,
    upperDirY: upper.y,
    lowerDirX: lower.x,
    lowerDirY: lower.y,
  };
}

/** Avança os dois fragmentos cortados; retorna null quando saem da tela. */
export function updateSlicedProjectile(p: ProjectileCut): ProjectileCut | null {
  const upper = {
    x: p.upper.x + p.upperDirX * PROJECTILE_CUT_SPEED,
    y: p.upper.y + p.upperDirY * PROJECTILE_CUT_SPEED,
  };
  const lower = {
    x: p.lower.x + p.lowerDirX * PROJECTILE_CUT_SPEED,
    y: p.lower.y + p.lowerDirY * PROJECTILE_CUT_SPEED,
  };

  const offscreen = (coords: { x: number; y: number }) =>
    coords.x < -ProjectileConstants.OFFSCREEN_MARGIN ||
    coords.x >
      ProjectileConstants.MAP_WIDTH + ProjectileConstants.OFFSCREEN_MARGIN ||
    coords.y < -ProjectileConstants.OFFSCREEN_MARGIN ||
    coords.y >
      ProjectileConstants.MAP_HEIGHT + ProjectileConstants.OFFSCREEN_MARGIN;

  if (offscreen(upper) && offscreen(lower)) return null;

  return { ...p, upper, lower };
}
