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
import { EXPLORE_MOVE_INTERVAL } from "@/gameRules/movement/explore";
import type { CollisionParams } from "@/utils/types/battle/collision";
import { useInventory } from "@/contexts/InventoryContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePlayerAnimation } from "@/hooks/battle/player/usePlayerAnimation";
import { BATTLE_DEFAULT_STATE } from "@/gameRules/battle/defaultState";
import { useBattleCollisionRef } from "@/hooks/battle/useBattleCollisionRef";
import { CHARACTER_KEY, PLAYER_CLASS_KEY } from "@/data/storageKeys";
import { slotKey } from "@/services/save/slotManager";
import { isCharacter } from "@/data/characters/list";
import { useSettings } from "@/contexts/SettingsContext";

type PlayerContextType = {
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  difficulty: NpcDifficulty;
  setDifficulty: (difficulty: NpcDifficulty) => void;

  setPosition: (
    x: number,
    y: number,
    direction?: Player["direction"],
    height?: number,
  ) => void;
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
  setHeightMap: (heightMap: number[][]) => void;
  setMode: (mode: PlayerMode) => void;
  restoreMode: () => void;
  resetBattleState: () => void;
  setBattleCollision: (params: CollisionParams) => void;

  playerClass: PlayerClass;
  chooseClass: (cls: PlayerClass) => void;

  lastBlockPressRef: React.RefObject<number>;
  battleTenacityRef: React.RefObject<number>;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { difficulty, setDifficulty } = useSettings();

  const [player, setPlayer] = useState<Player>(() => {
    const savedCharacter = localStorage.getItem(slotKey(CHARACTER_KEY));
    return {
      gridX: 6,
      gridY: 11,
      height: 0,
      direction: "up",
      character: isCharacter(savedCharacter) ? savedCharacter : "marcelo",
      ...BATTLE_DEFAULT_STATE,
      mode: "explore",
    };
  });

  const previousModeRef = useRef<PlayerMode>("explore");
  const battleTenacityRef = useRef(0);
  const { progress } = useCharacterProgress();
  usePlayerAnimation(
    player,
    setPlayer,
    battleTenacityRef,
    (progress[player.character]?.sleep ?? 0) > 0,
  );

  const movingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (player.moving) {
      if (movingTimerRef.current) clearTimeout(movingTimerRef.current);
      movingTimerRef.current = setTimeout(() => {
        setPlayer((p) => (p.moving ? { ...p, moving: false } : p));
      }, EXPLORE_MOVE_INTERVAL);
    }
    return () => {
      if (movingTimerRef.current) clearTimeout(movingTimerRef.current);
    };
  }, [player.moving, player.gridX, player.gridY, setPlayer]);

  const [currentMap, setCurrentMap] = useState<number[][]>([]);
  const [currentHeightMap, setCurrentHeightMap] = useState<number[][]>([]);
  const { toggleInventory } = useInventory();
  const { toggleNavbar, registerModeHandlers } = useNavbar();

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
    clearAllIntervals,
  } = usePlayerMovement(currentMap, currentHeightMap, player, setPlayer);

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

  const battleCollisionRef = useBattleCollisionRef();
  const lastBlockPressRef = useRef(0);
  const playerModeRef = useRef<PlayerMode>(player.mode);
  playerModeRef.current = player.mode;

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
  } = useBattleMovement(
    setPlayer,
    battleCollisionRef,
    lastBlockPressRef,
    playerModeRef,
  );

  const setBattleCollision = useCallback(
    (params: CollisionParams) => {
      battleCollisionRef.current = params;
    },
    [battleCollisionRef],
  );

  const attack = () => rawAttack();

  useEffect(() => {
    if (player.mode !== "explore") clearAllIntervals();
  }, [player.mode, clearAllIntervals]);

  function setMap(map: number[][]) {
    setCurrentMap(map);
  }

  function setHeightMap(heightMap: number[][]) {
    setCurrentHeightMap(heightMap);
  }

  function chooseClass(cls: PlayerClass) {
    setPlayerClass(cls);
  }

  function openInventory() {
    if (player.mode !== "explore") return;
    toggleInventory();
  }

  function openNavbar() {
    if (player.mode !== "explore" && player.mode !== "menu") return;
    toggleNavbar();
  }

  const setMode = useCallback(
    (mode: PlayerMode) => {
      setPlayer((p) => ({
        ...p,
        mode,
        ...(mode === "battle" && p.mode !== "battle"
          ? BATTLE_DEFAULT_STATE
          : {}),
      }));
      if (mode === "menu" && playerModeRef.current !== "menu") {
        previousModeRef.current = playerModeRef.current;
      }
    },
    [setPlayer],
  );

  const restoreMode = useCallback(() => {
    setPlayer((p) => ({ ...p, mode: previousModeRef.current }));
  }, [setPlayer]);

  useEffect(() => {
    registerModeHandlers({ restoreMode, setMode });
  }, [registerModeHandlers, restoreMode, setMode]);

  function resetBattleState() {
    setPlayer((p) => ({ ...p, ...BATTLE_DEFAULT_STATE }));
  }

  function setPosition(
    x: number,
    y: number,
    direction: Player["direction"] = "down",
    height?: number,
  ) {
    setPlayer((prev) => ({
      ...prev,
      gridX: x,
      gridY: y,
      direction,
      ...(height !== undefined ? { height } : {}),
    }));
  }

  function setCharacter(character: Player["character"]) {
    localStorage.setItem(slotKey(CHARACTER_KEY), character);
    setPlayer((prev) => ({ ...prev, character }));
  }

  const { getEquippedInfo } = useEquipment();

  useEffect(() => {
    const equippedPet = getEquippedInfo(player.character, "pet");
    const hasTurkeyPet = equippedPet?.id === "pet_turkey";
    setPlayer((prev) =>
      prev.hasPeru === hasTurkeyPet ? prev : { ...prev, hasPeru: hasTurkeyPet },
    );
  }, [getEquippedInfo, player.character, setPlayer]);

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
        setHeightMap,
        setMode,
        restoreMode,
        setPosition,
        setBattleCollision,

        playerClass,
        chooseClass,
        difficulty,
        setDifficulty,
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
