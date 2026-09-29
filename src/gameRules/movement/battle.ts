import {
  BATTLE_STEP,
  DASH_STEP,
  BATTLE_LIMITS,
} from "@/gameRules/movement/constants";
import {
  isPlayerFrozen,
  isPlayerParalyzed,
} from "@/gameRules/battle/status/statusEffects";
import {
  CANNOT_ACT_STATES,
  CROUCHED_STATES,
  IDLE_PRESERVED_STATES,
  MOVE_STATES,
  canStartSpecialFrom,
  hasHorizontalControl,
  isAttackPose,
  isIdleBlocked,
  isPlayerRestrained,
} from "@/gameRules/battle/playerStates";

const CROUCHED_STEP = 4;

/** Artur fica travado (sem mover/crouch/dash) enquanto segura o ataque (attack.svg). */
export function isPlayerAttackHolding(player: Player) {
  return player.character === "artur" && isAttackPose(player.state);
}

export function canAct(player: Player) {
  if (isPlayerFrozen(player)) return false;
  if (isPlayerRestrained(player)) return false;
  if (isPlayerAttackHolding(player)) return false;
  return player.mode === "battle" && !CANNOT_ACT_STATES.has(player.state);
}

export function isInBattle(player: Player) {
  return player.mode === "battle";
}

export function canExitState(player: Player) {
  return canStartSpecialFrom(player.state);
}

type MoveOptions = { canRun?: boolean; state?: PlayerState };

function resolveMovementState(
  state: PlayerState,
  canRun: boolean,
): PlayerState {
  // Sono zerado: só andar — nunca evolui para preRun/run (run.svg).
  if (!canRun && MOVE_STATES.has(state)) return "walk";
  if (state === "jump") return "jump";
  if (MOVE_STATES.has(state)) return state;
  if (CROUCHED_STATES.has(state)) return "walkCrounched";
  if (state === "preJump") return "preJump";
  return "walk";
}

function getStep(player: Player): number {
  const base = CROUCHED_STATES.has(player.state) ? CROUCHED_STEP : BATTLE_STEP;
  const speed = isPlayerParalyzed(player) ? Math.round(base / 2) : base;
  return Math.round(speed * player.movementSpeed);
}

function moveAxis(
  player: Player,
  direction: Direction,
  step: number,
  limit: number,
  options: MoveOptions = {},
): Player {
  const state =
    options.state ?? resolveMovementState(player.state, options.canRun ?? true);
  const x =
    direction === "left"
      ? Math.max(limit, player.x - step)
      : Math.min(limit, player.x + step);
  return { ...player, x, battleDirection: direction, state };
}

export function moveLeftBattle(player: Player, canRun = true): Player {
  if (!canAct(player)) return player;
  return moveAxis(player, "left", getStep(player), BATTLE_LIMITS.minX, {
    canRun,
  });
}

export function moveRightBattle(player: Player, canRun = true): Player {
  if (!canAct(player)) return player;
  return moveAxis(player, "right", getStep(player), BATTLE_LIMITS.maxX, {
    canRun,
  });
}

export function blockStart(p: Player): Player {
  if (!isInBattle(p)) return p;
  if (!hasHorizontalControl(p.state)) return p;

  return {
    ...p,
    state: "blocked",
  };
}

export function blockEnd(p: Player): Player {
  if (!isInBattle(p)) return p;
  if (!hasHorizontalControl(p.state)) return p;

  return {
    ...p,
    state: "idle",
  };
}

export function attackBattle(p: Player): Player {
  if (!canAct(p)) return p;

  return {
    ...p,
    state: p.state === "jump" ? "jump" : "attack",
  };
}

export function specialBattle(p: Player): Player {
  if (!canExitState(p)) return p;

  return {
    ...p,
    state: p.state === "jump" ? "jump" : "special",
  };
}

export function dashLeftBattle(p: Player): Player {
  if (
    p.mode !== "battle" ||
    !hasHorizontalControl(p.state) ||
    isPlayerFrozen(p) ||
    CROUCHED_STATES.has(p.state) ||
    isPlayerAttackHolding(p)
  ) {
    return p;
  }
  return moveAxis(p, "left", DASH_STEP, BATTLE_LIMITS.minX, { state: "dash" });
}

export function dashRightBattle(p: Player): Player {
  if (
    p.mode !== "battle" ||
    !hasHorizontalControl(p.state) ||
    isPlayerFrozen(p) ||
    CROUCHED_STATES.has(p.state) ||
    isPlayerAttackHolding(p)
  ) {
    return p;
  }
  return moveAxis(p, "right", DASH_STEP, BATTLE_LIMITS.maxX, { state: "dash" });
}

export function idleBattle(p: Player): Player {
  if (isIdleBlocked(p.state)) return p;

  if (CROUCHED_STATES.has(p.state)) {
    return { ...p, state: "idleCrounched" };
  }

  return {
    ...p,
    state: IDLE_PRESERVED_STATES.has(p.state) ? p.state : "idle",
  };
}

export function crouchToggle(player: Player): Player {
  if (player.state === "mostHonored") return player;
  if (player.state === "preJump") {
    return { ...player, velY: 0, state: "falling" };
  }
  if (player.state === "jump") {
    return { ...player, velY: 0, state: "falling" };
  }
  if (player.state === "falling") {
    return player;
  }

  if (CROUCHED_STATES.has(player.state)) {
    return { ...player, state: "idle" };
  }

  return { ...player, state: "idleCrounched" };
}
