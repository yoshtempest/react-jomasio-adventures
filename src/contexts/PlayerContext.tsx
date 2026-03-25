import { createContext, useContext, useState, type ReactNode } from "react";
import { map } from "../map";

type Direction = "up" | "down" | "left" | "right";

type Player = {
  gridX: number;
  gridY: number;
  direction: Direction;
};

type PlayerContextType = {
  player: Player;
  moveUp: () => void;
  moveDown: () => void;
  moveLeft: () => void;
  moveRight: () => void;
};

function canMoveTo(gridX: number, gridY: number) {
  if (!map[gridY] || map[gridY][gridX] === undefined) {
    return false;
  }

  return map[gridY][gridX] === 0;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const STEP = 1;

  const [player, setPlayer] = useState<Player>({
    gridX: 6,
    gridY: 11,
    direction: "up",
  });

  function moveUp() {
    setPlayer((p) => {
      const newY = p.gridY - STEP;
      if (!canMoveTo(p.gridX, newY)) return p;
      return { ...p, gridY: newY, direction: "up" };
    });
  }

  function moveDown() {
    setPlayer((p) => {
      const newY = p.gridY + STEP;
      if (!canMoveTo(p.gridX, newY)) return p;
      return { ...p, gridY: newY, direction: "down" };
    });
  }

  function moveLeft() {
    setPlayer((p) => {
      const newX = p.gridX - STEP;
      if (!canMoveTo(newX, p.gridY)) return p;
      return { ...p, gridX: newX, direction: "left" };
    });
  }

  function moveRight() {
    setPlayer((p) => {
      const newX = p.gridX + STEP;
      if (!canMoveTo(newX, p.gridY)) return p;
      return { ...p, gridX: newX, direction: "right" };
    });
  }

  return (
    <PlayerContext.Provider
      value={{ player, moveUp, moveDown, moveLeft, moveRight }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer precisa do PlayerProvider");
  return ctx;
}