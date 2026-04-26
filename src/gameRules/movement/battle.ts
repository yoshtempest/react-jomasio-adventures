import { BATTLE_STEP, BATTLE_LIMITS } from "@/utils/types/player/movement";
import type { Player } from "@/utils/types/player/player";


export function canAct(player: Player) {
  return player.mode === "battle" && player.state !== "blocked";
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
    state: "walk",
  };
}

export function moveRightBattle(player: Player): Player {
  if (!canAct(player)) return player;

  return {
    ...player,
    x: Math.min(BATTLE_LIMITS.maxX, player.x + BATTLE_STEP),
    battleDirection: "right",
    state: "walk",
  };
}

export function jumpBattle(p: Player): Player {
  if (!canAct(p)) return p;

  return {
    ...p,
    state: "jump",
    y: p.y - 80,
  };
}

export function landBattle(p: Player): Player {
  return {
    ...p,
    y: p.y + 80,
    state: "idle",
  };
}

export function blockStart(p: Player): Player {
  if (!isInBattle(p)) return p;

  if (p.character === "marcelo" || p.character === "samuel") {
    return {
      ...p,
      state: "blocked",
    };
  }

  return {
    ...p,
    state: "blocked",
    y: p.y + 40,
  };
}

export function blockEnd(p: Player): Player {
  if (!isInBattle(p)) return p;

  if (p.character === "marcelo" || p.character === "samuel") {
    return {
      ...p,
      state: "idle",
    };
  }

  return {
    ...p,
    state: "idle",
    y: p.y - 40,
  };
}

export function attackBattle(p: Player): Player {
  if (!canAct(p)) return p;

  return {
    ...p,
    state: "attack",
  };
}

export function specialBattle(p: Player): Player {
  if (!canExitState(p)) return p;

  return {
    ...p,
    state: "special",
  };
}

export function idleBattle(p: Player): Player {
  if (p.state === "blocked") return p;

  return {
    ...p,
    state: "idle",
  };
}