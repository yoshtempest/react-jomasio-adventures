import {
  BATTLE_STEP,
  DASH_STEP,
  BATTLE_LIMITS,
} from "@/gameRules/movement/constants";
import {
  isPlayerFrozen,
  isPlayerParalyzed,
} from "@/gameRules/battle/status/statusEffects";

const CROUCHED_STEP = 4;
const CROUCHED_STATES = new Set<PlayerState>([
  "idleCrounched",
  "walkCrounched",
]);

export function isPlayerRestrained(player: Player) {
  if (player.grabbedUntil != null && Date.now() < player.grabbedUntil) {
    return true;
  }
  if (player.throwStartTime > 0) return true;
  if (player.state === "fallen") return true;
  return false;
}

export function canAct(player: Player) {
  if (isPlayerFrozen(player)) return false;
  if (isPlayerRestrained(player)) return false;
  return (
    player.mode === "battle" &&
    player.state !== "blocked" &&
    player.state !== "stun" &&
    player.state !== "dash" &&
    player.state !== "charging"
  );
}

export function isInBattle(player: Player) {
  return player.mode === "battle";
}

export function canExitState(player: Player) {
  return player.state !== "blocked" && player.state !== "stun";
}

const MOVEMENT_STATES = new Set(["walk", "preRun", "run"]);

type MoveOptions = { canRun?: boolean; state?: PlayerState };

function resolveMovementState(
  state: PlayerState,
  canRun: boolean,
): PlayerState {
  // Sono zerado: só andar — nunca evolui para preRun/run (run.svg).
  if (!canRun && MOVEMENT_STATES.has(state)) return "walk";
  if (state === "jump") return "jump";
  if (MOVEMENT_STATES.has(state)) return state;
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
  if (p.state === "jump") return p;

  return {
    ...p,
    state: "blocked",
  };
}

export function blockEnd(p: Player): Player {
  if (!isInBattle(p)) return p;
  if (p.state === "jump") return p;

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
    isPlayerFrozen(p) ||
    CROUCHED_STATES.has(p.state)
  ) {
    return p;
  }
  return moveAxis(p, "left", DASH_STEP, BATTLE_LIMITS.minX, { state: "dash" });
}

export function dashRightBattle(p: Player): Player {
  if (
    p.mode !== "battle" ||
    isPlayerFrozen(p) ||
    CROUCHED_STATES.has(p.state)
  ) {
    return p;
  }
  return moveAxis(p, "right", DASH_STEP, BATTLE_LIMITS.maxX, { state: "dash" });
}

export { CROUCHED_STATES };

export function idleBattle(p: Player): Player {
  if (p.state === "blocked" || p.state === "stun") return p;
  if (p.state === "fallen") return p;

  if (CROUCHED_STATES.has(p.state)) {
    return { ...p, state: "idleCrounched" };
  }

  return {
    ...p,
    state:
      p.state === "jump" || p.state === "dash" || p.state === "charging"
        ? p.state
        : "idle",
  };
}

export function crouchToggle(player: Player): Player {
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
