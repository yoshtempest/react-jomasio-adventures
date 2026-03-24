import { createContext, useContext, useState, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right";

type Player = {
  x: number;
  y: number;
  direction: Direction;
};

type PlayerContextType = {
  player: Player;
  moveUp: () => void;
  moveDown: () => void;
  moveLeft: () => void;
  moveRight: () => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const STEP = 60;

  const [player, setPlayer] = useState<Player>({
    x: 0,
    y: 0,
    direction: "down",
  });

  function moveUp() {
    setPlayer((p) => ({ ...p, y: p.y - STEP, direction: "up" }));
  }

  function moveDown() {
    setPlayer((p) => ({ ...p, y: p.y + STEP, direction: "down" }));
  }

  function moveLeft() {
    setPlayer((p) => ({ ...p, x: p.x - STEP, direction: "left" }));
  }

  function moveRight() {
    setPlayer((p) => ({ ...p, x: p.x + STEP, direction: "right" }));
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