import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import type { NavbarOption, NavScreen } from "@/utils/types/player/navbar";
import { useToggle } from "@/hooks/useToggle";

const CLOSE_ANIMATION_MS = 500;

type NavbarContextType = {
  items: NavbarOption[];

  isNavOpen: boolean;
  isClosing: boolean;
  openNavbar: () => void;
  closeNavbar: () => void;
  toggleNavbar: () => void;

  screen: NavScreen;
  setScreen: (screen: NavScreen) => void;
  openConfigScreen: () => void;
};

const NavbarContext = createContext<NavbarContextType | null>(null);

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [items] = useState<NavbarOption[]>([]);
  const [screen, setScreenState] = useState<NavScreen>("menu");
  const { isOpen: isNavOpen, open: openToggle, close: closeToggle, toggle: toggleNavbar } = useToggle();
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const screenRef = useRef(screen);
  screenRef.current = screen;
  const isNavOpenRef = useRef(isNavOpen);
  isNavOpenRef.current = isNavOpen;

  const openNavbar = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
      setIsClosing(false);
    }
    openToggle();
  }, [openToggle]);

  const closeNavbar = useCallback(() => {
    if (!isNavOpenRef.current && !closeTimerRef.current) return;
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    const shouldAnimate = screenRef.current === "menu";
    setScreenState("menu");
    if (shouldAnimate) {
      setIsClosing(true);
      closeTimerRef.current = setTimeout(() => {
        closeToggle();
        setIsClosing(false);
        closeTimerRef.current = null;
      }, CLOSE_ANIMATION_MS);
    } else {
      closeToggle();
    }
  }, [closeToggle]);

  const setScreen = useCallback((s: NavScreen) => {
    setScreenState(s);
  }, []);

  const openConfigScreen = useCallback(() => {
    setScreenState("config");
    openNavbar();
  }, [openNavbar]);

  return (
    <NavbarContext.Provider
      value={{
        items,
        isNavOpen,
        isClosing,
        openNavbar,
        closeNavbar,
        toggleNavbar,
        screen,
        setScreen,
        openConfigScreen,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNavbar() {
  const context = useContext(NavbarContext);
  if (!context) throw new Error("useNavbar deve ser usado dentro do Provider");
  return context;
}
