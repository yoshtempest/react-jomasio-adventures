import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { BattleNavLocation } from "@/utils/types/player/battleNavbar";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useToggle } from "@/hooks/useToggle";
import { usePlayer } from "@/contexts/PlayerContext";

type BattleNavbarContextType = {
  isBattleNavOpen: boolean;
  isClosing: boolean;

  location: BattleNavLocation;
  setLocation: (location: BattleNavLocation) => void;

  openBattleNavbar: () => void;
  closeBattleNavbar: () => void;
  toggleBattleNavbar: () => void;
  finishClose: () => void;

  resetBattleNavbar: () => void;
};

const BattleNavbarContext = createContext<BattleNavbarContextType | null>(null);

export function BattleNavbarProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<BattleNavLocation>("menu");
  const {
    isOpen: isBattleNavOpen,
    open: openToggle,
    close: closeToggle,
  } = useToggle();
  const [isClosing, setIsClosing] = useState(false);

  const { player, setMode, restoreMode } = usePlayer();

  const locationRef = useLatestRef(location);
  const isBattleNavOpenRef = useLatestRef(isBattleNavOpen);
  const isClosingRef = useLatestRef(isClosing);
  const playerModeRef = useLatestRef(player.mode);

  const setLocation = useCallback((l: BattleNavLocation) => {
    setLocationState(l);
  }, []);

  // Pausa a batalha: modo "menu" congela gravidade/animações e o tempo de batalha.
  const openBattleNavbar = useCallback(() => {
    if (playerModeRef.current !== "battle") return;
    setIsClosing(false);
    setMode("menu");
    openToggle();
  }, [openToggle, playerModeRef, setMode]);

  const closeBattleNavbar = useCallback(() => {
    if (!isBattleNavOpenRef.current && !isClosingRef.current) return;
    const shouldAnimate = locationRef.current === "menu";
    setLocationState("menu");
    if (shouldAnimate) {
      if (!isClosingRef.current) setIsClosing(true);
      return;
    }
    closeToggle();
    restoreMode();
  }, [closeToggle, isBattleNavOpenRef, locationRef, isClosingRef, restoreMode]);

  const finishClose = useCallback(() => {
    if (!isClosingRef.current) return;
    setIsClosing(false);
    closeToggle();
    restoreMode();
  }, [closeToggle, isClosingRef, restoreMode]);

  const toggleBattleNavbar = useCallback(() => {
    if (isBattleNavOpenRef.current || isClosingRef.current) {
      closeBattleNavbar();
      return;
    }
    openBattleNavbar();
  }, [closeBattleNavbar, isBattleNavOpenRef, isClosingRef, openBattleNavbar]);

  // Fecha sem restaurar modo (usado ao montar/desmontar a cena de batalha).
  const resetBattleNavbar = useCallback(() => {
    setIsClosing(false);
    setLocationState("menu");
    closeToggle();
  }, [closeToggle]);

  const value = useMemo(
    () => ({
      isBattleNavOpen,
      isClosing,
      location,
      setLocation,
      openBattleNavbar,
      closeBattleNavbar,
      toggleBattleNavbar,
      finishClose,
      resetBattleNavbar,
    }),
    [
      isBattleNavOpen,
      isClosing,
      location,
      setLocation,
      openBattleNavbar,
      closeBattleNavbar,
      toggleBattleNavbar,
      finishClose,
      resetBattleNavbar,
    ],
  );

  return (
    <BattleNavbarContext.Provider value={value}>
      {children}
    </BattleNavbarContext.Provider>
  );
}

const DEFAULT_BATTLE_NAVBAR: BattleNavbarContextType = {
  isBattleNavOpen: false,
  isClosing: false,
  location: "menu",
  setLocation: () => {},
  openBattleNavbar: () => {},
  closeBattleNavbar: () => {},
  toggleBattleNavbar: () => {},
  finishClose: () => {},
  resetBattleNavbar: () => {},
};

// eslint-disable-next-line react-refresh/only-export-components
export function useBattleNavbar(): BattleNavbarContextType {
  const context = useContext(BattleNavbarContext);
  return context ?? DEFAULT_BATTLE_NAVBAR;
}
