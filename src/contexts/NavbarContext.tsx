import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { NavScreen } from "@/utils/types/player/navbar";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useToggle } from "@/hooks/useToggle";

type NavbarModeHandlers = {
  restoreMode: () => void;
  setMode: (mode: PlayerMode) => void;
};

type NavbarContextType = {
  isNavOpen: boolean;
  isClosing: boolean;

  openNavbar: () => void;
  closeNavbar: () => void;
  toggleNavbar: () => void;
  finishClose: () => void;

  screen: NavScreen;
  setScreen: (screen: NavScreen) => void;
  openScreen: (screen: Exclude<NavScreen, "menu">) => void;

  registerModeHandlers: (handlers: NavbarModeHandlers) => void;
};

const NavbarContext = createContext<NavbarContextType | null>(null);

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [screen, setScreenState] = useState<NavScreen>("menu");
  const {
    isOpen: isNavOpen,
    open: openToggle,
    close: closeToggle,
    toggle: toggleNavbar,
  } = useToggle();
  const [isClosing, setIsClosing] = useState(false);

  const screenRef = useLatestRef(screen);
  const isNavOpenRef = useLatestRef(isNavOpen);
  const isClosingRef = useLatestRef(isClosing);
  const modeHandlersRef = useRef<NavbarModeHandlers>({
    restoreMode: () => {},
    setMode: () => {},
  });

  const openNavbar = useCallback(() => {
    setIsClosing(false);
    openToggle();
  }, [openToggle]);

  const closeNavbar = useCallback(() => {
    if (!isNavOpenRef.current && !isClosingRef.current) return;
    const shouldAnimate = screenRef.current === "menu";
    setScreenState("menu");
    if (shouldAnimate) {
      if (!isClosingRef.current) setIsClosing(true);
      return;
    }
    closeToggle();
    modeHandlersRef.current.restoreMode();
  }, [closeToggle, isClosingRef, isNavOpenRef, screenRef]);

  const finishClose = useCallback(() => {
    if (!isClosingRef.current) return;
    setIsClosing(false);
    closeToggle();
    modeHandlersRef.current.restoreMode();
  }, [closeToggle, isClosingRef]);

  const setScreen = useCallback((s: NavScreen) => {
    setScreenState(s);
  }, []);

  const openScreen = useCallback(
    (s: Exclude<NavScreen, "menu">) => {
      setScreenState(s);
      modeHandlersRef.current.setMode("menu");
      openNavbar();
    },
    [openNavbar],
  );

  const registerModeHandlers = useCallback((handlers: NavbarModeHandlers) => {
    modeHandlersRef.current = handlers;
  }, []);

  const value = useMemo(
    () => ({
      isNavOpen,
      isClosing,
      openNavbar,
      closeNavbar,
      toggleNavbar,
      finishClose,
      screen,
      setScreen,
      openScreen,
      registerModeHandlers,
    }),
    [
      isNavOpen,
      isClosing,
      openNavbar,
      closeNavbar,
      toggleNavbar,
      finishClose,
      screen,
      setScreen,
      openScreen,
      registerModeHandlers,
    ],
  );

  return (
    <NavbarContext.Provider value={value}>{children}</NavbarContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNavbar() {
  const context = useContext(NavbarContext);
  if (!context) throw new Error("useNavbar deve ser usado dentro do Provider");
  return context;
}
