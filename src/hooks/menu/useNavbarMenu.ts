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

  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const playSelectRef = useRef(playSelect);
  playSelectRef.current = playSelect;
  const playCloseRef = useRef(playClose);
  playCloseRef.current = playClose;
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;
  const closeNavbarRef = useRef(closeNavbar);
  closeNavbarRef.current = closeNavbar;
  const setModeRef = useRef(setMode);
  setModeRef.current = setMode;

  // 🎮 registrar camada
  useEffect(() => {
    const controls = {
      onUp: () => {
        if (screenRef.current !== "menu") return;

        playMoveRef.current();
        setSelectedIndex((prev) =>
          circularPrev(prev, NAVBAR_OPTIONS.length)
        );
      },

      onDown: () => {
        if (screenRef.current !== "menu") return;

        playMoveRef.current();
        setSelectedIndex((prev) =>
          circularNext(prev, NAVBAR_OPTIONS.length)
        );
      },

      onConfirm: () => {
        if (screenRef.current !== "menu") return;

        playSelectRef.current();
        const selected = getSelected(NAVBAR_OPTIONS, selectedIndexRef.current);
        setScreen(selected.screen);
        return true;
      },

      onCancel: () => {
        playCloseRef.current();
        if (!shouldCloseToExplore(screenRef.current)) {
          setScreen("menu");
          return;
        }

        closeNavbarRef.current();
        setModeRef.current("explore");
      },

      blockGlobalOpen: true,
    };

    pushControlsRef.current(controls);
    return () => popControlsRef.current();
  }, []);

  return {
    screen,
    selectedIndex,
    options: NAVBAR_OPTIONS,
  };
}