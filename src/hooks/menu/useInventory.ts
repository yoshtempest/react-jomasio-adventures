import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { gridMove } from "@/gameRules/menu/navigation";
import { useInventory } from "@/contexts/InventoryContext";
import { useItemEffect } from "@/gameRules/items/useItem";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useAudio } from "@/contexts/AudioContext";
import { asset } from "@/utils/paths";
import type { FilterConfig } from "@/utils/types/inventory/filterConfig";

export function useInventoryMenu(
  isOpen: boolean,
  listRef?: React.RefObject<HTMLUListElement | null>,
  filterConfig: FilterConfig | null = null,
  chestReady = false,
  onOpenChest: () => void = () => {},
) {
  const { pushControls } = useGameControls();
  const { items: rawItems } = useInventory();
  const { sfxVolume } = useAudio();

  const items = filterConfig ? filterConfig.filteredItems : rawItems;
  const navLength = items.length;

  const sfxVolumeRef = useRef(sfxVolume);
  sfxVolumeRef.current = sfxVolume;

  const sfxPoolRef = useRef(new Map<string, HTMLAudioElement>());

  const playSFX = (src: string, volume = 1) => {
    const resolved = asset(src);
    let audio = sfxPoolRef.current.get(resolved);

    if (!audio) {
      audio = new Audio(resolved);
      sfxPoolRef.current.set(resolved, audio);
    }

    audio.pause();
    audio.currentTime = 0;
    audio.volume = volume * (sfxVolumeRef.current / 100);
    audio.play().catch(() => {});
  };

  const { getEffect } = useItemEffect({ playSFX });
  const { playMove, playSelect } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  const [filterFocused, setFilterFocused] = useState(false);
  const filterFocusedRef = useRef(filterFocused);

  const [chestFocused, setChestFocused] = useState(false);
  const chestFocusedRef = useRef(chestFocused);

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
    chestFocusedRef.current = chestFocused;
  }, [chestFocused]);

  useEffect(() => {
    if (!chestReady && chestFocusedRef.current) {
      setChestFocused(false);
    }
  }, [chestReady]);

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
  const filterConfigRef = useRef(filterConfig);
  filterConfigRef.current = filterConfig;
  const chestReadyRef = useRef(chestReady);
  chestReadyRef.current = chestReady;
  const onOpenChestRef = useRef(onOpenChest);
  onOpenChestRef.current = onOpenChest;

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onUp: () => {
        if (chestFocusedRef.current) return;

        if (filterFocusedRef.current) {
          if (chestReadyRef.current) {
            playMoveRef.current();
            setFilterFocused(false);
            setChestFocused(true);
          }
          return;
        }

        if (navLength === 0) return;

        const row = Math.floor(selectedIndexRef.current / 4);
        if (row === 0 && filterConfigRef.current) {
          if (chestReadyRef.current) {
            playMoveRef.current();
            setChestFocused(true);
            return;
          }
          playMoveRef.current();
          setFilterFocused(true);
          return;
        }

        playMoveRef.current();
        setSelectedIndex((prev) => gridMove(prev, 4, "up", navLength));
      },

      onDown: () => {
        if (chestFocusedRef.current) {
          playMoveRef.current();
          setChestFocused(false);
          if (filterConfigRef.current) {
            setFilterFocused(true);
          } else {
            setSelectedIndex(0);
          }
          return;
        }

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
        if (chestFocusedRef.current) return;

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
        if (chestFocusedRef.current) return;

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
        if (chestFocusedRef.current) {
          playSelectRef.current();
          onOpenChestRef.current();
          return true;
        }

        if (filterFocusedRef.current) {
          playSelectRef.current();
          return true;
        }

        playSelectRef.current();
        return handleUseItemRef.current(selectedIndexRef.current);
      },

      blockGlobalOpen: true,
    };

    const remove = pushControlsRef.current(controls);
    return () => remove();
  }, [isOpen, navLength]);

  return {
    selectedIndex,
    filterFocused,
    setFilterFocused,
    chestFocused,
  };
}
