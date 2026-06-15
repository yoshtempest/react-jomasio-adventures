import { moveExplore } from "@/gameRules/movement/explore";

export function usePlayerMovement(
  currentMap: number[][],
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
) {
  function moveUp() {
    setPlayer((p) => moveExplore(p, currentMap, "up"));
  }

  function moveDown() {
    setPlayer((p) => moveExplore(p, currentMap, "down"));
  }

  function moveLeft() {
    setPlayer((p) => moveExplore(p, currentMap, "left"));
  }

  function moveRight() {
    setPlayer((p) => moveExplore(p, currentMap, "right"));
  }

  return { moveUp, moveDown, moveLeft, moveRight };
}
