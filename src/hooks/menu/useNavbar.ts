import { useCallback } from "react";
import { useNavbar } from "@/contexts/NavbarContext";
import type { NavbarOption } from "@/utils/types/player/navbar";
import { usePlayer } from "@/contexts/PlayerContext";
import { NAVBAR_OPTIONS } from "@/data/options/navbar";
import { shouldCloseToExplore } from "@/gameRules/menu/flow";
import { getSelected } from "@/gameRules/menu/selection";
import { useCircularSelection } from "@/hooks/menu/useCircularSelection";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { useStableCallback } from "@/hooks/useStableCallback";
import { useGameControlsLayer } from "@/hooks/game/useGameControlsLayer";

export function useNavbarMenu() {
  const { closeNavbar, screen, setScreen } = useNavbar();
  const { setMode } = usePlayer();
  const { playSelect, playClose } = useMenuSFX();
  const { playSound } = useSoundEffects();

  const isActive = screen === "menu";
  const { selectedIndex, setSelectedIndex, selectedIndexRef, selectPrev, selectNext } =
    useCircularSelection({ length: NAVBAR_OPTIONS.length, enabled: isActive });

  const openIndex = useCallback(
    (index: number) => {
      playSelect();
      const selected: NavbarOption = getSelected(
        NAVBAR_OPTIONS,
        index,
      );
      setScreen(selected.screen);
      if (selected.confirmSfx) playSound(selected.confirmSfx);
    },
    [playSelect, playSound, setScreen],
  );

  const onUp = useStableCallback(selectPrev);
  const onDown = useStableCallback(selectNext);

  const onConfirm = useStableCallback(() => {
    if (!isActive) return false;
    openIndex(selectedIndexRef.current);
    return true;
  });

  const onSelect = useStableCallback((index: number) => {
    if (!isActive) return;
    setSelectedIndex(index);
    openIndex(index);
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
    onSelect,
  };
}
