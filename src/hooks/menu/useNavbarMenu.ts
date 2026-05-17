import { useEffect, useState, useRef } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { NAVBAR_OPTIONS } from "@/data/options/navbar";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { shouldCloseToExplore } from "@/gameRules/menu/flow";
import { getSelected } from "@/gameRules/menu/selection";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";

export function useNavbarMenu() {
  const { pushControls, popControls } = useGameControls();
  const { closeNavbar } = useNavbar();
  const { setMode } = usePlayer();
  const { playMove, playSelect, playClose } = useMenuSFX();

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
      onUp: () => {
        if (screenRef.current !== "menu") return;

        playMove();
        setSelectedIndex((prev) =>
          circularPrev(prev, NAVBAR_OPTIONS.length)
        );
      },

      onDown: () => {
        if (screenRef.current !== "menu") return;

        playMove();
        setSelectedIndex((prev) =>
          circularNext(prev, NAVBAR_OPTIONS.length)
        );
      },

      onConfirm: () => {
        if (screenRef.current !== "menu") return;

        playSelect();
        const selected = getSelected(NAVBAR_OPTIONS, selectedIndexRef.current);
        setScreen(selected.screen);
        return true;
      },

      onCancel: () => {
        playClose();
        if (!shouldCloseToExplore(screenRef.current)) {
          setScreen("menu");
          return;
        }

        closeNavbar();
        setMode("explore");
      },

      blockGlobalOpen: true,
    };

    pushControls(controls);
    return () => popControls();
  }, []);

  return {
    screen,
    selectedIndex,
    options: NAVBAR_OPTIONS,
  };
}