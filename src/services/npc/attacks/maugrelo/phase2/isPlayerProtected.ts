import { isPlayerFloating } from "@/gameRules/movement/battle";

export function isPlayerProtected(playerState: PlayerState): boolean {
  return (
    playerState === "idleCrounched" ||
    playerState === "walkCrounched" ||
    playerState === "dash" ||
    playerState === "jump" ||
    playerState === "preJump" ||
    playerState === "falling" ||
    playerState === "fallingAttack" ||
    playerState === "specialInAir" ||
    playerState === "preSpecialInAir" ||
    playerState === "specialInAirFinish" ||
    isPlayerFloating(playerState)
  );
}
