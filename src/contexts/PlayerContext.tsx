import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { usePlayerMovement } from "@/hooks/player/usePlayerMovement";
import { useBattleMovement } from "@/hooks/player/useBattleMovement";
import type { CollisionParams } from "@/hooks/player/useBattleMovement";
import { useInventory } from "@/contexts/InventoryContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { usePlayerAnimation } from "@/hooks/battle/player/usePlayerAnimation";
import { BATTLE_DEFAULT_STATE, createBattleCollisionRef } from "@/contexts/player/playerState";

type PlayerContextType = {
  player: Player;
  difficulty: NpcDifficulty;
  coins: number;
  addCoins: (amount: number) => void;
  hyperCoins: number;
  addHyperCoins: (amount: number) => void;
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
  releaseDownBattle: () => void;
  attack: () => void;
  special: () => void;
  dash: (direction: "left" | "right") => void;

  setMap: (map: number[][]) => void;
  setMode: (mode: PlayerMode) => void;
  resetBattleState: () => void;
  setBattleCollision: (params: CollisionParams) => void;

  playerClass: PlayerClass;
  chooseClass: (cls: PlayerClass) => void;

  toggleHasPeru: () => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [difficulty, setDifficulty] = useState<NpcDifficulty>("medium");
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem("coins");
    return saved ? Number(saved) : 200;
  });
  const [hyperCoins, setHyperCoins] = useState(() => {
    const saved = localStorage.getItem("hyperCoins");
    return saved ? Number(saved) : 0;
  });
  const [player, setPlayer] = useState<Player>(() => {
    const savedCharacter = localStorage.getItem("character");

    return {
      gridX: 6,
      gridY: 11,
      direction: "up",
      character: (savedCharacter as Player["character"]) || "marcelo",
      ...BATTLE_DEFAULT_STATE,
      mode: "explore",
    };
  });
  usePlayerAnimation(player, setPlayer);

  const [currentMap, setCurrentMap] = useState<number[][]>([]);
  const { toggleInventory } = useInventory();
  const { toggleNavbar } = useNavbar();

  const { moveUp, moveDown, moveLeft, moveRight } = usePlayerMovement(
    currentMap,
    setPlayer,
  );

  const [playerClass, setPlayerClass] = useState<PlayerClass>(() => {
    const saved = localStorage.getItem("player_class");

    if (saved === "fracote" || saved === "idiota" || saved === "amostradinho") {
      return saved;
    }

    return null;
  });

  useEffect(() => {
    localStorage.setItem("coins", String(coins));
  }, [coins]);

  useEffect(() => {
    localStorage.setItem("hyperCoins", String(hyperCoins));
  }, [hyperCoins]);

  useEffect(() => {
    if (playerClass) {
      localStorage.setItem("player_class", playerClass);
    }
  }, [playerClass]);

  const battleCollisionRef = createBattleCollisionRef();

  const {
    moveUpBattle,
    startMoveLeft,
    stopMoveLeft,
    startMoveRight,
    stopMoveRight,
    moveDownBattle,
    releaseDownBattle,
    attack: rawAttack,
    special,
    dash,
  } = useBattleMovement(setPlayer, battleCollisionRef);

  const setBattleCollision = useCallback((params: CollisionParams) => {
    battleCollisionRef.current = params;
  }, []);

  const attack = () => {
    rawAttack();
  };

  function setMap(map: number[][]) {
    setCurrentMap(map);
  }

  function chooseClass(cls: PlayerClass) {
    setPlayerClass(cls);
  }

  function addCoins(amount: number) {
    setCoins((prev) => prev + amount);
  }

  function addHyperCoins(amount: number) {
    setHyperCoins((prev) => prev + amount);
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
      ...(mode === "battle" ? BATTLE_DEFAULT_STATE : {}),
    }));
  }

  function resetBattleState() {
    setPlayer((p) => ({
      ...p,
      ...BATTLE_DEFAULT_STATE,
    }));
  }

  const setPosition = (
    x: number,
    y: number,
    direction: Player["direction"] = "down",
  ) => {
    setPlayer((prev) => ({
      ...prev,
      gridX: x,
      gridY: y,
      direction,
    }));
  };

  const setCharacter = (character: Player["character"]) => {
    localStorage.setItem("character", character);
    setPlayer((prev) => ({
      ...prev,
      character,
    }));
  };

  function toggleHasPeru() {
    setPlayer((prev) => ({
      ...prev,
      hasPeru: !prev.hasPeru,
    }));
  }

  return (
    <PlayerContext.Provider
      value={{
        player,
        coins,
        addCoins,
        hyperCoins,
        addHyperCoins,
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
        releaseDownBattle,
        attack,
        special,
        dash,

        resetBattleState,
        setMap,
        setMode,
        setPosition,
        setBattleCollision,
        playerClass,
        chooseClass,
        difficulty,
        setDifficulty,
        toggleHasPeru,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer precisa do PlayerProvider");
  return ctx;
}
