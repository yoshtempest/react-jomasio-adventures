import { ALL_STATES } from "@/gameRules/battle/playerStates";

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

  if (ALL_STATES.CROUCHED_STATES.has(player.state)) {
    return { ...player, state: "idle" };
  }

  return { ...player, state: "idleCrounched" };
}