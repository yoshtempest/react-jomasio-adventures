import {
  FIFTY_MS,
  ONE_HUNDRED_MS,
  TWO_HUNDRED_MS,
  THREE_HUNDRED_MS,
  SIX_HUNDRED_MS,
  EIGHT_HUNDRED_MS,
  ONE_THOUSAND_TWO_HUNDRED_MS,
  ONE_THOUSAND_FIVE_HUNDRED_MS,
  TWO_THOUSAND_MS,
  THREE_THOUSAND_MS,
  FIVE_THOUSAND_MS,
  EIGHT_THOUSAND_MS,
  FIVE_HUNDRED_MS,
} from "@/data/ms";

/** Tempo que o papel grudado fica mostrando explosion.svg antes de sumir (fade-out). */
export const STUCK_EXPLOSION_DISAPPEAR_MS = 300;

export const PRE_MOVE_DURATION = THREE_HUNDRED_MS;

export const THROW_ACTIVE_DURATION = TWO_HUNDRED_MS;

export const SLAP_ACTIVE_DURATION = THREE_HUNDRED_MS;

export const PUSH_ACTIVE_DURATION = THREE_HUNDRED_MS;

export const POST_ACTION_COOLDOWN = THREE_HUNDRED_MS;

export const SLAP_RANGE = 50;

export const PUSH_RANGE = 120;

export const MELEE_SWITCH_DISTANCE = 100;

export const SLAP_COOLDOWN = ONE_THOUSAND_TWO_HUNDRED_MS;

export const PUSH_COOLDOWN = ONE_THOUSAND_FIVE_HUNDRED_MS;

export const THROW_COOLDOWN = FIVE_THOUSAND_MS;

export const MAX_GROUND_PAPERS = 3;

export const MEDITATION_ARMOR_INTERVAL = THREE_THOUSAND_MS;

export const RUN_TRANSITION_DELAY = ONE_THOUSAND_FIVE_HUNDRED_MS;

export const PAPER_GRAVITY = 0.35;

export const PAPER_INITIAL_VEL_X = -2.5;

export const PAPER_INITIAL_VEL_Y = -4;

export const PAPER_GROUND_Y = 535;

export const PAPER_GROUND_Y_SPREAD = 30;

export const PAPER_X_SPREAD = 60;

export const PAPER_VEL_X_SPREAD = 1.5;

export const PAPER_MIN_DISTANCE = 50;

export const PAPER_EXPLOSION_DURATION = FIVE_HUNDRED_MS;

/** Tempo que o papel pisado pisca antes de virar explosion.svg e causar dano. */
export const PAPER_BLINK_DURATION = TWO_THOUSAND_MS;

export const PAPER_STEP_RADIUS = 30;

/**
 * Tolerância vertical (eixo Y) para o papel explodir quando o jogador pisa.
 * O jogador fica com os pés na mesma altura dos papéis no chão (dy baixo).
 * Ao pular por cima, os pés ficam bem acima dos papéis (dy alto), então
 * ficam acima deste limite e os papéis não explodem, continuando no chão.
 */
export const PAPER_STEP_VERTICAL_RANGE = 60;

export const PAPER_ATTACK_RANGE = 200;

export const STUCK_PAPER_DURATION = THREE_THOUSAND_MS;

export const PHASE2_RISE_DISTANCE = 300;

export const PHASE2_RISE_SPEED = 3;

export const ORBIT_RADIUS = 80;

export const ORBIT_Y_OFFSET = 100;

export const ORBIT_COUNT = 9;

export const ORBIT_FIRE_INTERVAL = FIVE_HUNDRED_MS;

export const PHASE2_DESCEND_SPEED = 5;

export const PHASE2_LANDING_DURATION = THREE_HUNDRED_MS;

export const PHASE2_PREMOVE_DURATION = ONE_HUNDRED_MS;

export const PHASE2_LASER_DURATION = EIGHT_THOUSAND_MS;

/** Janela de vulnerabilidade após o laser: o Maugrelo "não faz nada" e o jogador pode atacar. */
export const PHASE2_VULNERABLE_DURATION = THREE_THOUSAND_MS;

export const PHASE2_DEBUFF_DURATION = EIGHT_HUNDRED_MS;

export const PHASE2_THROW_PAPER_INTERVAL = SIX_HUNDRED_MS;

export const PHASE2_THROW_PAPER_COUNT = 3;

export const PHASE2_CHARGE_SPEED = 4;

export const PHASE2_PUSH_ACTIVE_DURATION = THREE_HUNDRED_MS;

export const LASER_DAMAGE_INTERVAL = FIFTY_MS;

export const LASER_BODY_OFFSET = 120;
