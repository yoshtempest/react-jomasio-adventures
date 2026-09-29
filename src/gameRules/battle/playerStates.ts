/**
 * Fonte única de verdade sobre os estados do jogador (`PlayerState`).
 *
 * Os grupos semânticos (e a divisão `PlayerCanActState | PlayerCantActState`)
 * vivem em `utils/types/global.d.ts`. Aqui ficam os `Set`s e os predicados
 * derivados desses grupos, para que nenhum outro arquivo precise repetir a
 * lista de literais.
 *
 * Para incluir um estado novo: acrescente no grupo de tipo em `global.d.ts` e
 * no `Set` correspondente aqui. `animationFlow` é `Record<PlayerState, …>`
 * exaustivo, então um estado sem entrada quebra a compilação.
 */

type StatePredicate = (state: PlayerState) => boolean;

/**
 * Cria um `Set` de estados a partir de literais. O tipo genérico amarra o set
 * ao grupo semântico: um literal fora do grupo (ou renomeado) não compila.
 */
function stateSet<Group extends PlayerState>(
  ...members: readonly Group[]
): ReadonlySet<PlayerState> {
  return new Set<PlayerState>(members);
}

/** Une vários grupos em um set derivado (sem repetir literais). */
export function unionOf(
  ...groups: ReadonlySet<PlayerState>[]
): ReadonlySet<PlayerState> {
  const members = new Set<PlayerState>();
  for (const group of groups) for (const state of group) members.add(state);
  return members;
}

/** Cria o predicado de membership de um grupo. */
function isOf(group: ReadonlySet<PlayerState>): StatePredicate {
  return (state) => group.has(state);
}

/**
 * Lê um mapa de dados (sprite, pasta, som) por estado. Aceita mapas tipados
 * por um grupo mais narrow — estados fora do grupo retornam `null` em vez de
 * forçar um cast no ponto de uso.
 */
export function stateData<T, Group extends PlayerState>(
  map: Readonly<Partial<Record<Group, T>>> | undefined,
  state: PlayerState,
): T | null {
  if (map == null) return null;
  return (map as Readonly<Partial<Record<PlayerState, T>>>)[state] ?? null;
}

// ── Locomoção ─────────────────────────────────────────────
/** Andar/correr no chão (`pre*` é o windup da animação). */
export const MOVE_STATES = stateSet<PlayerMoveState>("walk", "preRun", "run");
/** Corrida — usada para respeitar a passiva de sono (não evolui p/ `run`). */
export const RUN_STATES = stateSet<PlayerMoveState>("preRun", "run");
/** Dash — o deslocamento é rápido e não pode ser interceptado. */
export const DASH_STATES = stateSet<PlayerChargeState>("dash");
/** Agachado: abaixa a hitbox e golpes altos passam por cima. */
export const CROUCHED_STATES = stateSet<PlayerCrouchState>(
  "idleCrounched",
  "walkCrounched",
);

// ── Ar ────────────────────────────────────────────────────
/** No ar — a gravidade está no comando. */
export const AIRBORNE_STATES = stateSet<PlayerAirState>(
  "preJump",
  "jump",
  "falling",
  "fallingAttack",
);
/** No ar em movimento vertical (pulo iniciado ou queda), sem o windup. */
export const AIR_FALL_STATES = stateSet<PlayerAirState>("jump", "falling");
/** Subconjunto que volta ao chão ao tocar o solo. */
export const LANDING_STATES = unionOf(
  AIR_FALL_STATES,
  stateSet<PlayerAirState>("preJump"),
);
/** Special aéreo. */
export const AIR_SPECIAL_STATES = stateSet<PlayerAirSpecialState>(
  "preSpecialInAir",
  "specialInAir",
  "specialInAirFinish",
);
/** Golpe aéreo do combo. */
export const AIR_MELEE_STATES = stateSet<PlayerAirMeleeState>(
  "airGrab",
  "airKick",
);
/**
 * Golpes que seguram o personagem no ar (o eixo Y fica congelado): special
 * aéreo e golpes aéreos do combo.
 */
export const AIR_FROZEN_STATES = unionOf(AIR_SPECIAL_STATES, AIR_MELEE_STATES);

// ── Golpes ────────────────────────────────────────────────
/** Ataque básico já ativo (causa dano). */
export const BASIC_STRIKE_STATES = stateSet<PlayerBasicAttackState>(
  "attack",
  "crit",
);
/**
 * Special já ativo (causa dano). Precisa ser listado: os projéteis do NPC são
 * interceptados no alcance do golpe, e antes só `attack` era aceito — nenhum
 * special alcançava um projétil.
 */
export const SPECIAL_STRIKE_STATES = stateSet<PlayerState>(
  "special",
  "specialInAir",
  "specialInAirFinish",
);
/** Qualquer golpe ativo (básico ou special). */
export const STRIKE_STATES = unionOf(
  BASIC_STRIKE_STATES,
  SPECIAL_STRIKE_STATES,
);
/** Windup do ataque básico. */
export const ATTACK_WINDUP_STATES = stateSet<PlayerBasicAttackState>(
  "preAttack",
  "preKick",
);
/**
 * Ataque básico em pose: windup `preAttack` ou golpe `attack` segurado. É o
 * que o ORA do artur mantém na pose de ataque.
 */
export const ATTACK_POSE_STATES = stateSet<PlayerBasicAttackState>(
  "preAttack",
  "attack",
);
/** Sequência do special de solo, do windup ao golpe. */
export const SPECIAL_TRIGGER_STATES = stateSet<PlayerSpecialState>(
  "preSpecial",
  "preSpecial2",
  "special",
);

// ── Habilidades ───────────────────────────────────────────
/** Genki Dama (emanuel) — o personagem sobe e fica flutuando. */
export const GENKI_DAMA_STATES = stateSet<PlayerGenkiDamaState>(
  "genkiDamaRising",
  "preparingGenkiDama",
  "throwGenkiDama",
);
/** Genki Dama já no topo: o personagem fica preso lá até o release. */
export const GENKI_DAMA_HOLD_STATES = stateSet<PlayerGenkiDamaState>(
  "preparingGenkiDama",
  "throwGenkiDama",
);
/** "I Am Atomic" (marcelo). */
export const ATOMIC_STATES = stateSet<PlayerAtomicState>(
  "preparingAtomic",
  "finalizatingAtomic",
);
/** Expansão de Domínio (marcelo). */
export const DOMAIN_EXPANSION_STATES = stateSet<PlayerDomainExpansionState>(
  "preMugetsu",
  "mugetsu",
);
/** Laser da Forma Vastolord (marcelo). */
export const LASER_STATES = stateSet<PlayerLaserState>("laser");

// ── Defesa e reação ───────────────────────────────────────
/** Defesa: bloqueio e a contra-ofensiva que sai dele. */
export const BLOCK_STATES = stateSet<PlayerBlockState>(
  "blocked",
  "blockAttack",
);
/** Reações que tiram o controle do jogador. */
export const HIT_REACTION_STATES = stateSet<PlayerHitState>("stun", "fallen");
/** Bloqueio ou atordoamento — o jogador não age, mas não está contido. */
const BLOCK_OR_STUN_STATES = stateSet<PlayerState>("blocked", "stun");

// ── Travamento ────────────────────────────────────────────
/** Estados que seguram o personagem e travam novas ações. */
export const ACTION_LOCK_STATES = stateSet<PlayerActionLockState>(
  "dash",
  "charging",
  "chargingKi",
  "mostHonored",
  "genkiDamaRising",
  "preparingGenkiDama",
  "throwGenkiDama",
  "laser",
);
/** O jogador não age: trava de ação, defesa ou reação a dano. */
export const CANNOT_ACT_STATES = unionOf(
  ACTION_LOCK_STATES,
  BLOCK_OR_STUN_STATES,
);
/** `idle` não entra: defesa em curso, atordoamento ou contido no chão. */
export const IDLE_BLOCKED_STATES = unionOf(
  BLOCK_OR_STUN_STATES,
  HIT_REACTION_STATES,
);
/** `idle` não sobrescreve estes — o estado em curso é mais importante. */
export const IDLE_PRESERVED_STATES = unionOf(
  ACTION_LOCK_STATES,
  stateSet<PlayerAirState>("jump"),
);
/** Passiva "O Abençoado": enquanto ativo nenhum golpe do NPC causa dano. */
export const INVULNERABLE_STATES = stateSet<PlayerHonoredState>("mostHonored");
/** Sem alvo ao alcance do NPC: invencível ou flutuando acima do golpe. */
export const NPC_UNHITTABLE_STATES = unionOf(
  INVULNERABLE_STATES,
  GENKI_DAMA_STATES,
);
/**
 * Estados em que o jogador não tem controle no plano horizontal: no ar
 * (não bloqueia, não dasha) ou durante o O Abençoado.
 */
export const HORIZONTAL_CONTROL_LOCKED_STATES = unionOf(
  stateSet<PlayerAirState>("jump"),
  INVULNERABLE_STATES,
);
/** Trava a entrada no special (defesa, atordoamento e O Abençoado). */
export const SPECIAL_LOCKED_STATES = unionOf(
  BLOCK_OR_STUN_STATES,
  INVULNERABLE_STATES,
);

// ── Combo do emanuel ──────────────────────────────────────
/** Golpes de solo do combo. */
export const GROUND_COMBO_STATES = stateSet<PlayerComboState>(
  "punch",
  "hook",
  "lowKick",
);
/** Qualquer golpe do combo, solo ou aéreo. */
export const COMBO_STATES = unionOf(GROUND_COMBO_STATES, AIR_MELEE_STATES);

// ── Predicados ────────────────────────────────────────────
export const isMoveState = isOf(MOVE_STATES);
export const isRunState = isOf(RUN_STATES);
export const isCrouched = isOf(CROUCHED_STATES);
export const isDashing = isOf(DASH_STATES);
export const isAirborne = isOf(AIRBORNE_STATES);
export const isAirFalling = isOf(AIR_FALL_STATES);
export const isLanding = isOf(LANDING_STATES);
export const isAirSpecial = isOf(AIR_SPECIAL_STATES);
export const isAirMelee = isOf(AIR_MELEE_STATES);
export const isAirFrozen = isOf(AIR_FROZEN_STATES);
export const isBasicStrike = isOf(BASIC_STRIKE_STATES);
export const isSpecialStrike = isOf(SPECIAL_STRIKE_STATES);
export const isStrike = isOf(STRIKE_STATES);
export const isAttackWindup = isOf(ATTACK_WINDUP_STATES);
export const isAttackPose = isOf(ATTACK_POSE_STATES);
export const isSpecialTrigger = isOf(SPECIAL_TRIGGER_STATES);
export const isGenkiDama = isOf(GENKI_DAMA_STATES);
export const isGenkiDamaHold = isOf(GENKI_DAMA_HOLD_STATES);
export const isAtomic = isOf(ATOMIC_STATES);
export const isDomainExpansion = isOf(DOMAIN_EXPANSION_STATES);
export const isLaser = isOf(LASER_STATES);
export const isBlock = isOf(BLOCK_STATES);
export const isHitReaction = isOf(HIT_REACTION_STATES);
export const isActionLocked = isOf(ACTION_LOCK_STATES);
export const isActionBlocked = isOf(CANNOT_ACT_STATES);
export const isIdlePreserved = isOf(IDLE_PRESERVED_STATES);
export const isIdleBlocked = isOf(IDLE_BLOCKED_STATES);
export const isInvulnerable = isOf(INVULNERABLE_STATES);
export const isNpcUnhittable = isOf(NPC_UNHITTABLE_STATES);
export const hasHorizontalControl = (state: PlayerState) =>
  !HORIZONTAL_CONTROL_LOCKED_STATES.has(state);
export const canStartSpecialFrom = (state: PlayerState) =>
  !SPECIAL_LOCKED_STATES.has(state);
export const isGroundCombo = isOf(GROUND_COMBO_STATES);
export const isCombo = isOf(COMBO_STATES);

/**
 * Estado usado para escolher o sprite: `charging` não tem sprite próprio
 * (reaproveita o `idle`) e o agachado mantém o seu.
 */
export function resolveSpriteState(state: PlayerState): PlayerState {
  return state === "charging" ? "idle" : state;
}

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
