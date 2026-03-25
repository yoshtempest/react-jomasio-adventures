import { createContext, useContext, useState, type ReactNode } from "react";

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
  setMap: (map: number[][]) => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const STEP = 1;

  const [player, setPlayer] = useState<Player>({
    gridX: 6,
    gridY: 11,
    direction: "up",
  });

  // ✅ AGORA ESTÁ NO LUGAR CERTO
  const [currentMap, setCurrentMap] = useState<number[][]>([]);

  function canMoveTo(gridX: number, gridY: number) {
    if (!currentMap[gridY] || currentMap[gridY][gridX] === undefined) {
      return false;
    }

    return currentMap[gridY][gridX] === 0;
  }

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

  function setMap(map: number[][]) {
    setCurrentMap(map);
  }

  return (
    <PlayerContext.Provider
      value={{ player, moveUp, moveDown, moveLeft, moveRight, setMap }}
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