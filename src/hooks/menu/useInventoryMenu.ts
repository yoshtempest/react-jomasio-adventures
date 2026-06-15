import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { useInventory } from "@/contexts/InventoryContext";
import { useItemEffect } from "@/gameRules/items/useItem";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useAudio } from "@/contexts/AudioContext";
import { asset } from "@/utils/asset";

export function useInventoryMenu(isOpen: boolean) {
  const { pushControls, popControls } = useGameControls();
  const { items } = useInventory();
  const { volume: masterVolume } = useAudio();

  const masterVolumeRef = useRef(masterVolume);
  masterVolumeRef.current = masterVolume;

  const playSFX = (src: string, volume = 1) => {
    const audio = new Audio(asset(src));
    audio.volume = volume * (masterVolumeRef.current / 100);
    audio.play().catch(() => {});
  };

  const { getEffect } = useItemEffect({ playSFX });
  const { playMove, playSelect } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  // mantém ref sincronizada (evita stale no confirm)
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  // garante que o índice nunca fique inválido
  useEffect(() => {
    setSelectedIndex((prev) =>
      items.length === 0 ? 0 : Math.min(prev, items.length - 1),
    );
  }, [items]);

  const handleUseItemRef = useRef<(index: number) => boolean>(() => false);
  handleUseItemRef.current = function handleUseItem(index: number) {
    const item = items[index];
    if (!item) return false;

    const effect = getEffect(item.id);
    if (!effect) return false;

    effect();
    return true;
  };

  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const playSelectRef = useRef(playSelect);
  playSelectRef.current = playSelect;
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onUp: () => {
        const length = items.length;
        if (length === 0) return;
        playMoveRef.current();

        setSelectedIndex((prev) => circularPrev(prev, length));
      },

      onDown: () => {
        const length = items.length;
        if (length === 0) return;

        playMoveRef.current();
        setSelectedIndex((prev) => circularNext(prev, length));
      },

      onConfirm: () => {
        playSelectRef.current();
        return handleUseItemRef.current(selectedIndexRef.current);
      },

      blockGlobalOpen: true,
    };

    pushControlsRef.current(controls);
    return () => popControlsRef.current();
  }, [isOpen, items]); // 👈 ESSENCIAL

  return {
    selectedIndex,
    options: items,
  };
}
