import { useEffect, useState, useRef } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { NAVBAR_OPTIONS } from "@/data/options/navbar";

export function useNavbarMenu() {
  const { pushControls, popControls } = useGameControls();
  const { closeNavbar } = useNavbar();
  const { setMode } = usePlayer();

  const [screen, setScreen] = useState("menu");
  const [selectedIndex, setSelectedIndex] = useState(0);

    const selectedIndexRef = useRef(selectedIndex);
    const screenRef = useRef(screen);

    useEffect(() => {
        selectedIndexRef.current = selectedIndex;
        screenRef.current = screen;
    }, [selectedIndex, screen]);

  // 🎮 registrar camada
  useEffect(() => {
    const controls = {
      onConfirm: () => {
        if (screen !== "menu") return;

        const selected = NAVBAR_OPTIONS[selectedIndexRef.current];
        setScreen(selected.screen);
      },

      onCancel: () => {
        if (screenRef.current !== "menu") {
          setScreen("menu");
          return;
        }

        closeNavbar();
        setMode("explore");
      },

        blockGlobalOpen: true,
    };

    pushControls(controls);

    return () => {
      popControls(); // 🔥 remove ao desmontar
    };
  }, []);

  // ⬆️⬇️ ainda pode usar window (ou evoluir depois)
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
  }, []);

  return {
    screen,
    selectedIndex,
    options: NAVBAR_OPTIONS,
  };
}