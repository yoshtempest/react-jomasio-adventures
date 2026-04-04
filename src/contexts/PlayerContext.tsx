import { createContext, useContext, useState, type ReactNode } from "react";
import type { Player, PlayerMode } from "@/utils/types/player";
import { usePlayerMovement } from "@/hooks/player/usePlayerMovement";
import { useBattleMovement } from "@/hooks/player/useBattleMovement";
import { useInventory } from "@/contexts/InventoryContext";

type PlayerContextType = {
  player: Player;
  setPosition: (x: number, y: number, direction?: Player["direction"]) => void;

  moveUp: () => void;
  moveDown: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  openInventory: () => void;

  moveUpBattle: () => void;
  moveLeftBattle: () => void;
  moveRightBattle: () => void;
  moveDownBattle: () => void;
  punch: () => void;
  special: () => void;

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
  const { toggleInventory } = useInventory();

  // 🔥 hooks separados
  const { moveUp, moveDown, moveLeft, moveRight } =
    usePlayerMovement(currentMap, setPlayer);

  const { moveUpBattle, moveLeftBattle, moveRightBattle, moveDownBattle, punch, special } =
    useBattleMovement(setPlayer);

  function setMap(map: number[][]) {
    setCurrentMap(map);
  }

  function openInventory() {
    if (player.mode !== "explore") return;
    toggleInventory();
  }

  function setMode(mode: PlayerMode) {
    setPlayer((p) => ({
      ...p,
      mode,
      ...(mode === "battle"
        ? {
            x: 100,
            y: 600,
            state: "idle",
            battleDirection: "right",
          }
        : {}),
    }));
  }
  const setPosition = (x: number, y: number, direction: Player["direction"] = "down") => {
    setPlayer((prev) => ({
      ...prev,
      gridX: x,
      gridY: y,
      direction,
    }));
  };

  return (
    <PlayerContext.Provider
      value={{
        player,

        moveUp,
        moveDown,
        moveLeft,
        moveRight,
        openInventory,

        moveUpBattle,
        moveLeftBattle,
        moveRightBattle,
        moveDownBattle,
        punch,
        special,

        setMap,
        setMode,
        setPosition,
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