import {
  BATTLE_STEP,
  DASH_STEP,
  BATTLE_LIMITS,
} from "@/utils/types/player/movement";

const CROUCHED_STEP = 4;
const CROUCHED_STATES = new Set<PlayerState>(["idleCrounched", "walkCrounched"]);

export function canAct(player: Player) {
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

function resolveMovementState(state: PlayerState): PlayerState {
  if (state === "jump") return "jump";
  if (MOVEMENT_STATES.has(state)) return state;
  if (CROUCHED_STATES.has(state)) return "walkCrounched";
  if (state === "preJump") return "preJump";
  return "walk";
}

function getStep(state: PlayerState): number {
  return CROUCHED_STATES.has(state) ? CROUCHED_STEP : BATTLE_STEP;
}

export function moveLeftBattle(player: Player): Player {
  if (!canAct(player)) return player;

  return {
    ...player,
    x: Math.max(BATTLE_LIMITS.minX, player.x - getStep(player.state)),
    battleDirection: "left",
    state: resolveMovementState(player.state),
  };
}

export function moveRightBattle(player: Player): Player {
  if (!canAct(player)) return player;

  return {
    ...player,
    x: Math.min(BATTLE_LIMITS.maxX, player.x + getStep(player.state)),
    battleDirection: "right",
    state: resolveMovementState(player.state),
  };
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
  if (p.mode !== "battle") return p;
  if (CROUCHED_STATES.has(p.state)) return p;
  return {
    ...p,
    x: Math.max(BATTLE_LIMITS.minX, p.x - DASH_STEP),
    battleDirection: "left",
    state: "dash",
  };
}

export function dashRightBattle(p: Player): Player {
  if (p.mode !== "battle") return p;
  if (CROUCHED_STATES.has(p.state)) return p;
  return {
    ...p,
    x: Math.min(BATTLE_LIMITS.maxX, p.x + DASH_STEP),
    battleDirection: "right",
    state: "dash",
  };
}

export { CROUCHED_STATES };

export function idleBattle(p: Player): Player {
  if (p.state === "blocked" || p.state === "stun") return p;

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
    return { ...player, velY: 0, state: "idle" };
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
