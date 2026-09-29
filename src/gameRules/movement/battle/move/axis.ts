import { resolveMovementState } from "./resolveMovementState";

type MoveOptions = { canRun?: boolean; state?: PlayerState };

export function moveAxis(
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
