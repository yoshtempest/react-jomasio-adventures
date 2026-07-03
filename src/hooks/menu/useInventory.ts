import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { gridMove } from "@/gameRules/menu/navigation";
import { useInventory } from "@/contexts/InventoryContext";
import { useItemEffect } from "@/gameRules/items/useItem";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useAudio } from "@/contexts/AudioContext";
import { asset } from "@/utils/asset";
import type { FilterConfig } from "@/utils/types/inventory/filterConfig";


export function useInventoryMenu(
  isOpen: boolean,
  listRef?: React.RefObject<HTMLUListElement | null>,
  filterConfig: FilterConfig | null = null,
) {
  const { pushControls, popControls } = useGameControls();
  const { items: rawItems } = useInventory();
  const { sfxVolume } = useAudio();

  const items = filterConfig ? filterConfig.filteredItems : rawItems;
  const navLength = items.length;

  const sfxVolumeRef = useRef(sfxVolume);
  sfxVolumeRef.current = sfxVolume;

  const playSFX = (src: string, volume = 1) => {
    const audio = new Audio(asset(src));
    audio.volume = volume * (sfxVolumeRef.current / 100);
    audio.play().catch(() => {});
  };

  const { getEffect } = useItemEffect({ playSFX });
  const { playMove, playSelect } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  const [filterFocused, setFilterFocused] = useState(false);
  const filterFocusedRef = useRef(filterFocused);

  useEffect(() => {
    if (!listRef?.current) return;

    const container = listRef.current;
    const selectedElement = container.children[selectedIndex] as HTMLElement;

    if (!selectedElement) return;

    selectedElement.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [selectedIndex, listRef]);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    filterFocusedRef.current = filterFocused;
  }, [filterFocused]);

  useEffect(() => {
    setSelectedIndex((prev) =>
      navLength === 0 ? 0 : Math.min(prev, navLength - 1),
    );
  }, [navLength]);

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
  const filterConfigRef = useRef(filterConfig);
  filterConfigRef.current = filterConfig;

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onUp: () => {
        if (filterFocusedRef.current) return;

        if (navLength === 0) return;

        const row = Math.floor(selectedIndexRef.current / 4);
        if (row === 0 && filterConfigRef.current) {
          playMoveRef.current();
          setFilterFocused(true);
          return;
        }

        playMoveRef.current();
        setSelectedIndex((prev) => gridMove(prev, 4, "up", navLength));
      },

      onDown: () => {
        if (filterFocusedRef.current) {
          playMoveRef.current();
          setFilterFocused(false);
          setSelectedIndex(0);
          return;
        }

        if (navLength === 0) return;
        playMoveRef.current();
        setSelectedIndex((prev) => gridMove(prev, 4, "down", navLength));
      },

      onLeft: () => {
        if (filterFocusedRef.current && filterConfigRef.current) {
          playMoveRef.current();
          const cfg = filterConfigRef.current;
          const idx = cfg.labels.findIndex((l) => l.type === cfg.active);
          const prevIdx = idx <= 0 ? cfg.labels.length - 1 : idx - 1;
          cfg.onChange(cfg.labels[prevIdx].type);
          return;
        }

        if (navLength === 0) return;
        playMoveRef.current();
        setSelectedIndex((prev) => gridMove(prev, 4, "left", navLength));
      },

      onRight: () => {
        if (filterFocusedRef.current && filterConfigRef.current) {
          playMoveRef.current();
          const cfg = filterConfigRef.current;
          const idx = cfg.labels.findIndex((l) => l.type === cfg.active);
          const nextIdx = idx >= cfg.labels.length - 1 ? 0 : idx + 1;
          cfg.onChange(cfg.labels[nextIdx].type);
          return;
        }

        if (navLength === 0) return;
        playMoveRef.current();
        setSelectedIndex((prev) => gridMove(prev, 4, "right", navLength));
      },

      onConfirm: () => {
        if (filterFocusedRef.current) {
          playSelectRef.current();
          return true;
        }

        playSelectRef.current();
        return handleUseItemRef.current(selectedIndexRef.current);
      },

      blockGlobalOpen: true,
    };

    pushControlsRef.current(controls);
    return () => popControlsRef.current();
  }, [isOpen, navLength]);

  return {
    selectedIndex,
    filterFocused,
    setFilterFocused,
  };
}
