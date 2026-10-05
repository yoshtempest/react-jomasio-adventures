import { ALL_PREDICATES } from "@/gameRules/battle/playerStates";

/**
 * Elevação do projétil em relação ao chão — o que decide se agachar desvia.
 *
 * Agachar abaixa a hitbox do jogador, então um projétil **aéreo** passa por
 * cima; um projétil **terrestre** rasteja rente ao chão e acerta o jogador
 * agachado do mesmo jeito que acerta em pé. O `variant: "ground"` do
 * `Projectile` é a declaração mais forte dessa regra (é terrestre por
 * definição); projéteis `common` declaram no dado com `canCrouchDodge: false`.
 *
 * O dash não entra aqui: i-frame é total, vale para qualquer elevação.
 */
export type ProjectileHeight = "ground" | "air";

/** Quanto a hitbox do jogador sobe ao agachar (px). */
const CROUCH_HITBOX_LIFT = 30;

/** Agachar evita o projétil? Só projétil aéreo é desviado pelo agachamento. */
export function crouchDodgesProjectile(
  playerState: PlayerState,
  height: ProjectileHeight,
): boolean {
  return height === "air" && ALL_PREDICATES.isCrouched(playerState);
}

/**
 * Altura que o centro do projétil precisa alcançar para acertar o jogador,
 * considerando a hitbox abaixada pelo agachamento.
 */
export function getProjectileHitY(
  playerY: number,
  playerState: PlayerState,
  height: ProjectileHeight,
): number {
  return crouchDodgesProjectile(playerState, height)
    ? playerY - CROUCH_HITBOX_LIFT
    : playerY;
}
