/**
 * Estados do jogador em que o golpe ativo (básico ou special) causa dano.
 *
 * O special precisa ser listado: os projéteis do NPC são interceptados no
 * alcance do golpe, e antes eles só aceitavam "attack" — nenhum special
 * alcançava um projétil.
 */
const BASIC_STRIKE_STATES = new Set<PlayerState>(["attack", "crit"]);

const SPECIAL_STRIKE_STATES = new Set<PlayerState>([
  "special",
  "specialInAir",
  "specialInAirFinish",
]);

export function isBasicStrikeState(state: PlayerState): boolean {
  return BASIC_STRIKE_STATES.has(state);
}

export function isSpecialStrikeState(state: PlayerState): boolean {
  return SPECIAL_STRIKE_STATES.has(state);
}

/** true quando o estado atual do jogador é um golpe que causa dano. */
export function isStrikeState(state: PlayerState): boolean {
  return BASIC_STRIKE_STATES.has(state) || SPECIAL_STRIKE_STATES.has(state);
}
