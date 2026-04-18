import { createContext, useContext, useState, type ReactNode } from "react";
import type { NavbarOption } from "@/utils/types/navbar";

type NavbarContextType = {
  items: NavbarOption[];

  isNavOpen: boolean;
  openNavbar: () => void;
  closeNavbar: () => void;
  toggleNavbar: () => void;
};

const NavbarContext = createContext<NavbarContextType | null>(null);

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [items] = useState<NavbarOption[]>([]);
  const [isNavOpen, setIsOpen] = useState(false);

  function toggleNavbar() {
    setIsOpen((prev) => !prev);
  }

  function openNavbar() {
    setIsOpen(true);
  }

  function closeNavbar() {
    setIsOpen(false);
  }

  return (
    <NavbarContext.Provider
      value={{
        items,
        isNavOpen,
        openNavbar,
        closeNavbar,
        toggleNavbar
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (!context) throw new Error("useNavbar deve ser usado dentro do Provider");
  return context;
}