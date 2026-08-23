import { useCallback } from "react";
import { useBattleNavbar } from "@/contexts/BattleNavbarContext";
import type { BattleNavbarOption } from "@/utils/types/player/battleNavbar";
import { BATTLE_NAVBAR_OPTIONS } from "@/data/options/battleNavbar";
import { getSelected } from "@/gameRules/menu/selection";
import { useCircularSelection } from "@/hooks/menu/useCircularSelection";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { useStableCallback } from "@/hooks/useStableCallback";
import { useGameControlsLayer } from "@/hooks/game/useGameControlsLayer";

export function useBattleNavbarMenu() {
  const { closeBattleNavbar, location, setLocation } = useBattleNavbar();
  const { playSelect, playClose } = useMenuSFX();
  const { playSound } = useSoundEffects();

  const isActive = location === "menu";
  const {
    selectedIndex,
    setSelectedIndex,
    selectedIndexRef,
    selectPrev,
    selectNext,
  } = useCircularSelection({
    length: BATTLE_NAVBAR_OPTIONS.length,
    enabled: isActive,
  });

  const openIndex = useCallback(
    (index: number) => {
      playSelect();
      const selected: BattleNavbarOption = getSelected(
        BATTLE_NAVBAR_OPTIONS,
        index,
      );
      setLocation(selected.screen);
      if (selected.confirmSfx) playSound(selected.confirmSfx);
    },
    [playSelect, playSound, setLocation],
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
    if (location !== "menu") {
      setLocation("menu");
    } else {
      closeBattleNavbar();
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
    location,
    selectedIndex,
    options: BATTLE_NAVBAR_OPTIONS,
    onSelect,
  };
}
