import { type Player } from "@/utils/types/player";

export function usePlayerMovement(
  currentMap: number[][],
  setPlayer: React.Dispatch<React.SetStateAction<Player>>
) {
  const STEP = 1;

  function canMoveTo(gridX: number, gridY: number) {
    if (!currentMap[gridY] || currentMap[gridY][gridX] === undefined) {
      return false;
    }
    return currentMap[gridY][gridX] === 0;
  }

  function moveUp() {
    setPlayer((p) => {
      if (p.mode !== "explore") return p;

      const newY = p.gridY - STEP;
      if (!canMoveTo(p.gridX, newY)) {
        return { ...p, direction: "up" };
      };

      return { ...p, gridY: newY, direction: "up" };
    });
  }

  function moveDown() {
    setPlayer((p) => {
      if (p.mode !== "explore") return p;

      const newY = p.gridY + STEP;
      if (!canMoveTo(p.gridX, newY)) {
        return { ...p, direction: "down" };
      };

      return { ...p, gridY: newY, direction: "down" };
    });
  }

  function moveLeft() {
    setPlayer((p) => {
      if (p.mode !== "explore") return p;

      const newX = p.gridX - STEP;
      if (!canMoveTo(newX, p.gridY)) {
        return { ...p, direction: "left" };
      };

      return { ...p, gridX: newX, direction: "left" };
    });
  }

  function moveRight() {
    setPlayer((p) => {
      if (p.mode !== "explore") return p;

      const newX = p.gridX + STEP;
      if (!canMoveTo(newX, p.gridY)) {
        return { ...p, direction: "right" };
      };

      return { ...p, gridX: newX, direction: "right" };
    });
  }

  return { moveUp, moveDown, moveLeft, moveRight };
}