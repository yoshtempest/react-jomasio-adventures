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
    x: -130,
    y: 250,
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

// function moveUp() {
//   setPlayer((p) => {
//     const newY = p.y - STEP;

//     if (!canMoveTo(p.x, newY)) return p;

//     return { ...p, y: newY, direction: "up" };
//   });
// }

// function moveDown() {
//   setPlayer((p) => {
//     const newY = p.y + STEP;

//     if (!canMoveTo(p.x, newY)) return p;

//     return { ...p, y: newY, direction: "down" };
//   });
// }

// function moveLeft() {
//   setPlayer((p) => {
//     const newX = p.x - STEP;

//     if (!canMoveTo(newX, p.y)) return p;

//     return { ...p, x: newX, direction: "left" };
//   });
// }

// function moveRight() {
//   setPlayer((p) => {
//     const newX = p.x + STEP;

//     if (!canMoveTo(newX, p.y)) return p;

//     return { ...p, x: newX, y: p.y, direction: "right" };
//   });
// }

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