import {
  BATTLE_STEP,
  DASH_STEP,
  BATTLE_LIMITS,
} from "@/utils/types/player/movement";

export function canAct(player: Player) {
  return (
    player.mode === "battle" &&
    player.state !== "blocked" &&
    player.state !== "dash"
  );
}

export function isInBattle(player: Player) {
  return player.mode === "battle";
}

export function canExitState(player: Player) {
  return player.state !== "blocked";
}

export function moveLeftBattle(player: Player): Player {
  if (!canAct(player)) return player;

  return {
    ...player,
    x: Math.max(BATTLE_LIMITS.minX, player.x - BATTLE_STEP),
    battleDirection: "left",
    state: player.state === "jump" ? "jump" : "walk",
  };
}

export function moveRightBattle(player: Player): Player {
  if (!canAct(player)) return player;

  return {
    ...player,
    x: Math.min(BATTLE_LIMITS.maxX, player.x + BATTLE_STEP),
    battleDirection: "right",
    state: player.state === "jump" ? "jump" : "walk",
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
  return {
    ...p,
    x: Math.max(BATTLE_LIMITS.minX, p.x - DASH_STEP),
    battleDirection: "left",
    state: "dash",
  };
}

export function dashRightBattle(p: Player): Player {
  if (p.mode !== "battle") return p;
  return {
    ...p,
    x: Math.min(BATTLE_LIMITS.maxX, p.x + DASH_STEP),
    battleDirection: "right",
    state: "dash",
  };
}

export function idleBattle(p: Player): Player {
  if (p.state === "blocked") return p;

  return {
    ...p,
    state: p.state === "jump" || p.state === "dash" ? p.state : "idle",
  };
}
