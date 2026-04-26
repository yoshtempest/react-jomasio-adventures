import type { Player } from "@/utils/types/player/player";

export function isMovementLocked(
  mode: Player["mode"],
  isNavOpen: boolean
) {
  return mode === "select" || isNavOpen;
}

export function canJump(isJumping: boolean) {
  return !isJumping;
}