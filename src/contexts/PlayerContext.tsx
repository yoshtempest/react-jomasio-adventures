import { createContext, useContext, useState, type ReactNode } from "react";
import type { Player, PlayerMode, PlayerClass } from "@/utils/types/player/player";
import { usePlayerMovement } from "@/hooks/player/usePlayerMovement";
import { useBattleMovement } from "@/hooks/player/useBattleMovement";
import { useInventory } from "@/contexts/InventoryContext";
import { useNavbar } from "@/contexts/NavbarContext";
import type { NpcDifficulty } from "@/utils/types/npc/npcProgress";
import { usePlayerAnimation } from "@/hooks/battle/usePlayerAnimation";

type PlayerContextType = {
  player: Player;
  difficulty: NpcDifficulty;
  coins: number;
  addCoins: (amount: number) => void;
  setDifficulty: (difficulty: NpcDifficulty) => void;

  setPosition: (x: number, y: number, direction?: Player["direction"]) => void;
  setCharacter: (character: Player["character"]) => void;

  moveUp: () => void;
  moveDown: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  openInventory: () => void;
  openNavbar: () => void;

  moveUpBattle: () => void;
  startMoveLeft: () => void;
  stopMoveLeft: () => void;
  startMoveRight: () => void;
  stopMoveRight: () => void;
  moveDownBattle: () => void;
  releaseDownBattle: () => void; // 👈 ADICIONE AQUI
  attack: () => void;
  special: () => void;

  setMap: (map: number[][]) => void;
  setMode: (mode: PlayerMode) => void;
  resetBattleState: () => void;

  playerClass: PlayerClass;
  chooseClass: (cls: PlayerClass) => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [difficulty, setDifficulty] = useState<NpcDifficulty>("medium");
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem("coins");
    return saved ? Number(saved) : 200; // 👈 começa com 200
  });
  const [player, setPlayer] = useState<Player>(() => {
    const savedCharacter = localStorage.getItem("character");

    return {
      gridX: 6,
      gridY: 11,
      direction: "up",
      character: (savedCharacter as Player["character"]) || "marcelo",

      x: 100,
      y: 300,
      groundY: 600,
      velY: 0,
      battleDirection: "right",
      state: "idle",
      mode: "explore",
    };
  });
  usePlayerAnimation(player, setPlayer);

  const [currentMap, setCurrentMap] = useState<number[][]>([]);
  const { toggleInventory } = useInventory();
  const { toggleNavbar } = useNavbar();

  // 🔥 hooks separados
  const { moveUp, moveDown, moveLeft, moveRight } =
    usePlayerMovement(currentMap, setPlayer);

  const [playerClass, setPlayerClass] = useState<PlayerClass>(() => {
    const saved = localStorage.getItem("player_class");

    if (saved === "fracote" || saved === "idiota" || saved === "amostradinho") {
      return saved;
    }

    return null;
  });

  const {
    moveUpBattle,
    startMoveLeft,
    stopMoveLeft,
    startMoveRight,
    stopMoveRight,
    moveDownBattle,
    releaseDownBattle, // 👈 AQUI
    attack,
    special,
  } = useBattleMovement(setPlayer);

  function setMap(map: number[][]) {
    setCurrentMap(map);
  }

  function chooseClass(cls: PlayerClass) {
    localStorage.setItem("player_class", cls!);
    setPlayerClass(cls);
  }

  function addCoins(amount: number) {
    setCoins((prev) => {
      const total = prev + amount;
      localStorage.setItem("coins", String(total));
      return total;
    });
  }

  function openInventory() {
    if (player.mode !== "explore") return;
    toggleInventory();
  }
  function openNavbar() {

    if (player.mode !== "explore") return;
    toggleNavbar();
  }

  function setMode(mode: PlayerMode) {
    setPlayer((p) => ({
      ...p,
      mode,
      ...(mode === "battle"
        ? {
            x: 100,
            y: 600,
            groundY: 600,
            velY: 0,
            state: "idle",
            battleDirection: "right",
          }
        : {}),
    }));
  }

  function resetBattleState() {
    setPlayer((p) => ({
      ...p,
      x: 100,
      y: 600,
      groundY: 600,
      velY: 0,
      state: "idle",
      battleDirection: "right",
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

  const setCharacter = (character: Player["character"]) => {
    localStorage.setItem("character", character); // 👈 salva
    setPlayer((prev) => ({
      ...prev,
      character,
    }));
  };

  return (
    <PlayerContext.Provider
      value={{
        player,
        coins,
        addCoins,
        setCharacter,

        moveUp,
        moveDown,
        moveLeft,
        moveRight,
        openInventory,
        openNavbar,

        moveUpBattle,
        startMoveLeft,
        stopMoveLeft,
        startMoveRight,
        stopMoveRight,
        moveDownBattle,
        releaseDownBattle, // 👈 AQUI
        attack,
        special,

        resetBattleState,
        setMap,
        setMode,
        setPosition,
        playerClass,
        chooseClass,
        difficulty,
        setDifficulty,
        
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