import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { usePlayerMovement } from "@/hooks/player/usePlayerMovement";
import { useBattleMovement } from "@/hooks/battle/player/useMovement";
import type { CollisionParams } from "@/utils/types/battle/collision";
import { useInventory } from "@/contexts/InventoryContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { usePlayerAnimation } from "@/hooks/battle/player/usePlayerAnimation";
import {
  BATTLE_DEFAULT_STATE,
  useBattleCollisionRef,
} from "@/utils/types/player/state";
import {
  CHARACTER_KEY,
  PLAYER_CLASS_KEY,
  DIFFICULTY_KEY,
} from "@/data/storageKeys";
import { slotKey } from "@/utils/save/slotManager";

type PlayerContextType = {
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  difficulty: NpcDifficulty;
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
  startMoveUpExplore: () => void;
  stopMoveUpExplore: () => void;
  startMoveDownExplore: () => void;
  stopMoveDownExplore: () => void;
  startMoveLeftExplore: () => void;
  stopMoveLeftExplore: () => void;
  startMoveRightExplore: () => void;
  stopMoveRightExplore: () => void;
  blockStart: () => void;
  blockEnd: () => void;
  toggleCrouch: () => void;
  attack: () => void;
  special: () => void;
  dash: (direction: "left" | "right") => void;
  setPlayerState: (state: PlayerState) => void;

  setMap: (map: number[][]) => void;
  setMode: (mode: PlayerMode) => void;
  resetBattleState: () => void;
  setBattleCollision: (params: CollisionParams) => void;

  playerClass: PlayerClass;
  chooseClass: (cls: PlayerClass) => void;

  toggleHasPeru: () => void;
  lastBlockPressRef: React.RefObject<number>;
  battleTenacityRef: React.RefObject<number>;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [difficulty, setDifficulty] = useState<NpcDifficulty>(() => {
    const saved = localStorage.getItem(slotKey(DIFFICULTY_KEY));
    if (
      saved === "easy" ||
      saved === "medium" ||
      saved === "hard" ||
      saved === "insano"
    )
      return saved;
    return "medium";
  });

  const [player, setPlayer] = useState<Player>(() => {
    const savedCharacter = localStorage.getItem(slotKey(CHARACTER_KEY));
    return {
      gridX: 6,
      gridY: 11,
      direction: "up",
      character: (savedCharacter as Player["character"]) || "marcelo",
      ...BATTLE_DEFAULT_STATE,
      mode: "explore",
    };
  });
  const battleTenacityRef = useRef(0);
  usePlayerAnimation(player, setPlayer, battleTenacityRef);

  const movingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (player.moving) {
      if (movingTimerRef.current) clearTimeout(movingTimerRef.current);
      movingTimerRef.current = setTimeout(() => {
        setPlayer((p) => (p.moving ? { ...p, moving: false } : p));
      }, 150);
    }
    return () => {
      if (movingTimerRef.current) clearTimeout(movingTimerRef.current);
    };
  }, [player.moving, player.gridX, player.gridY, setPlayer]);

  const [currentMap, setCurrentMap] = useState<number[][]>([]);
  const { toggleInventory } = useInventory();
  const { toggleNavbar } = useNavbar();

  const {
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    startMoveUpExplore,
    stopMoveUpExplore,
    startMoveDownExplore,
    stopMoveDownExplore,
    startMoveLeftExplore,
    stopMoveLeftExplore,
    startMoveRightExplore,
    stopMoveRightExplore,
  } = usePlayerMovement(currentMap, setPlayer);

  const [playerClass, setPlayerClass] = useState<PlayerClass>(() => {
    const saved = localStorage.getItem(slotKey(PLAYER_CLASS_KEY));
    if (saved === "fracote" || saved === "idiota" || saved === "amostradinho")
      return saved;
    return null;
  });

  useEffect(() => {
    if (playerClass)
      localStorage.setItem(slotKey(PLAYER_CLASS_KEY), playerClass);
  }, [playerClass]);

  useEffect(() => {
    localStorage.setItem(slotKey(DIFFICULTY_KEY), difficulty);
  }, [difficulty]);

  const battleCollisionRef = useBattleCollisionRef();
  const lastBlockPressRef = useRef(0);

  const {
    moveUpBattle,
    startMoveLeft,
    stopMoveLeft,
    startMoveRight,
    stopMoveRight,
    blockStart,
    blockEnd,
    toggleCrouch,
    attack: rawAttack,
    special,
    dash,
    setPlayerState,
  } = useBattleMovement(setPlayer, battleCollisionRef, lastBlockPressRef);

  const setBattleCollision = useCallback(
    (params: CollisionParams) => {
      battleCollisionRef.current = params;
    },
    [battleCollisionRef],
  );

  const attack = () => rawAttack();

  function setMap(map: number[][]) {
    setCurrentMap(map);
  }

  function chooseClass(cls: PlayerClass) {
    setPlayerClass(cls);
  }

  function openInventory() {
    if (player.mode !== "explore") return;
    toggleInventory();
  }

  function openNavbar() {
    if (player.mode !== "explore") return;
    toggleNavbar();
  }

  const setMode = useCallback(
    (mode: PlayerMode) => {
      setPlayer((p) => ({
        ...p,
        mode,
        ...(mode === "battle" ? BATTLE_DEFAULT_STATE : {}),
      }));
    },
    [setPlayer],
  );

  function resetBattleState() {
    setPlayer((p) => ({ ...p, ...BATTLE_DEFAULT_STATE }));
  }

  function setPosition(
    x: number,
    y: number,
    direction: Player["direction"] = "down",
  ) {
    setPlayer((prev) => ({ ...prev, gridX: x, gridY: y, direction }));
  }

  function setCharacter(character: Player["character"]) {
    localStorage.setItem(slotKey(CHARACTER_KEY), character);
    setPlayer((prev) => ({ ...prev, character }));
  }

  function toggleHasPeru() {
    setPlayer((prev) => ({ ...prev, hasPeru: !prev.hasPeru }));
  }

  return (
    <PlayerContext.Provider
      value={{
        player,
        setPlayer,
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
        startMoveUpExplore,
        stopMoveUpExplore,
        startMoveDownExplore,
        stopMoveDownExplore,
        startMoveLeftExplore,
        stopMoveLeftExplore,
        startMoveRightExplore,
        stopMoveRightExplore,
        blockStart,
        blockEnd,
        toggleCrouch,
        attack,
        special,
        dash,
        setPlayerState,

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
        lastBlockPressRef,
        battleTenacityRef,
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
