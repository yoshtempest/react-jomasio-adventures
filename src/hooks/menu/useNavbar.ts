import { useState } from "react";
import { useNavbar } from "@/contexts/NavbarContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { NAVBAR_OPTIONS } from "@/data/options/navbar";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { shouldCloseToExplore } from "@/gameRules/menu/flow";
import { getSelected } from "@/gameRules/menu/selection";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useStableCallback } from "@/hooks/useStableCallback";
import { useGameControlsLayer } from "@/hooks/useGameControlsLayer";
import { useSelectableIndex } from "@/hooks/useSelectableIndex";

export function useNavbarMenu() {
  const { closeNavbar } = useNavbar();
  const { setMode } = usePlayer();
  const { playMove, playSelect, playClose } = useMenuSFX();

  const [screen, setScreen] = useState("menu");
  const { selectedIndex, setSelectedIndex, selectedIndexRef } = useSelectableIndex();

  const onUp = useStableCallback(() => {
    if (screen !== "menu") return true;
    playMove();
    setSelectedIndex((prev) => circularPrev(prev, NAVBAR_OPTIONS.length));
    return true;
  });

  const onDown = useStableCallback(() => {
    if (screen !== "menu") return true;
    playMove();
    setSelectedIndex((prev) => circularNext(prev, NAVBAR_OPTIONS.length));
    return true;
  });

  const onConfirm = useStableCallback(() => {
    if (screen !== "menu") return true;
    playSelect();
    const selected = getSelected(NAVBAR_OPTIONS, selectedIndexRef.current);
    setScreen(selected.screen);
    return true;
  });

  const onCancel = useStableCallback(() => {
    playClose();
    if (!shouldCloseToExplore(screen)) {
      setScreen("menu");
    } else {
      closeNavbar();
      setMode("explore");
    }
    return true;
  });

  useGameControlsLayer(
    {
      onUp,
      onDown,
      onConfirm,
      onCancel,
      blockGlobalOpen: true,
    },
    [],
  );

  return {
    screen,
    selectedIndex,
    options: NAVBAR_OPTIONS,
  };
}
