import { useEffect, useState } from "react";
import { useNavbar } from "@/contexts/NavbarContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { NAVBAR_OPTIONS } from "@/data/options/navbar";
import type { NavScreen } from "@/utils/types/navbar";

export function useNavbarMenu() {
  const { closeNavbar } = useNavbar();
  const { setMode } = usePlayer();
  const { setOnConfirm } = useGameControls();

  const [screen, setScreen] = useState<NavScreen>("menu");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 🎮 navegação (↑ ↓)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (screen !== "menu") return;

      if (e.key === "ArrowUp" || e.key === "w") {
        setSelectedIndex((prev) =>
          prev === 0 ? NAVBAR_OPTIONS.length - 1 : prev - 1
        );
      }

      if (e.key === "ArrowDown" || e.key === "s") {
        setSelectedIndex((prev) =>
          prev === NAVBAR_OPTIONS.length - 1 ? 0 : prev + 1
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen]);

  // 🅰️ confirmar
  useEffect(() => {
    setOnConfirm(() => () => {
      if (screen !== "menu") return;

      const selected = NAVBAR_OPTIONS[selectedIndex];
      setScreen(selected.screen);
    });

    return () => setOnConfirm(undefined);
  }, [selectedIndex, screen, setOnConfirm]);

  // 🅱️ voltar
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "b") {
        if (screen !== "menu") {
          setScreen("menu");
          return;
        }

        closeNavbar();
        setMode("explore");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen, closeNavbar, setMode]);

  return {
    screen,
    selectedIndex,
    options: NAVBAR_OPTIONS,
  };
}