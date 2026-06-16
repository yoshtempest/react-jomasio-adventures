import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useGameControls } from "@/contexts/GameControlsContext";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";

const GAME_MODE_OPTIONS = [
  { label: "História", route: "/home" },
  { label: "PVP Online", route: "/matchmaking" },
  { label: "História Online", route: "/story/online" }, // opcional
];

export function useGameModeMenu() {
  const navigate = useNavigate();
  const { pushControls, popControls } = useGameControls();
  const { playMove, playSelect } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedIndexRef = useRef(selectedIndex);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const playSelectRef = useRef(playSelect);
  playSelectRef.current = playSelect;
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;

  useEffect(() => {
    const controls = {
      onUp: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          circularPrev(prev, GAME_MODE_OPTIONS.length),
        );
      },

      onDown: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          circularNext(prev, GAME_MODE_OPTIONS.length),
        );
      },

      onConfirm: () => {
        playSelectRef.current();
        const selected = GAME_MODE_OPTIONS[selectedIndexRef.current];

        navigate(selected.route);
        return true;
      },

      // ❌ não tem cancel aqui (menu inicial)
      onCancel: () => {},

      blockGlobalOpen: true,
    };

    pushControlsRef.current(controls);
    return () => popControlsRef.current();
  }, [navigate]);

  return {
    selectedIndex,
    options: GAME_MODE_OPTIONS,
  };
}
