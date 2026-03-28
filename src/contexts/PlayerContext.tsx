import { createContext, useContext, useState, type ReactNode } from "react";
import type { Player, PlayerMode } from "@/utils/types/player";
import { usePlayerMovement } from "@/hooks/player/usePlayerMovement";
import { useBattleMovement } from "@/hooks/player/useBattleMovement";

type PlayerContextType = {
  player: Player;

  moveUp: () => void;
  moveDown: () => void;
  moveLeft: () => void;
  moveRight: () => void;

  moveLeftBattle: () => void;
  moveRightBattle: () => void;
  punch: () => void;

  setMap: (map: number[][]) => void;
  setMode: (mode: PlayerMode) => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player>({
    gridX: 6,
    gridY: 11,
    direction: "up",

    x: 100,
    y: 300,
    battleDirection: "right",
    state: "idle",

    mode: "explore",
  });

  const [currentMap, setCurrentMap] = useState<number[][]>([]);

  // 🔥 hooks separados
  const { moveUp, moveDown, moveLeft, moveRight } =
    usePlayerMovement(currentMap, setPlayer);

  const { moveLeftBattle, moveRightBattle, punch } =
    useBattleMovement(setPlayer);

  function setMap(map: number[][]) {
    setCurrentMap(map);
  }

  function setMode(mode: PlayerMode) {
    setPlayer((p) => ({
      ...p,
      mode,
      ...(mode === "battle"
        ? {
            x: 100,
            y: 300,
            state: "idle",
            battleDirection: "right",
          }
        : {}),
    }));
  }

  return (
    <PlayerContext.Provider
      value={{
        player,

        moveUp,
        moveDown,
        moveLeft,
        moveRight,

        moveLeftBattle,
        moveRightBattle,
        punch,

        setMap,
        setMode,
      }}
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