import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { NavbarOption, NavScreen } from "@/utils/types/player/navbar";
import { useToggle } from "@/hooks/useToggle";

type NavbarContextType = {
  items: NavbarOption[];

  isNavOpen: boolean;
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
  const { isOpen: isNavOpen, open: openNavbar, close: closeToggle, toggle: toggleNavbar } = useToggle();

  const closeNavbar = useCallback(() => {
    setScreenState("menu");
    closeToggle();
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
