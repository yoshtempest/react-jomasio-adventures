import { useEffect, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";

type Params = {
  isOpen: boolean;
  onCollectAll: () => void;
  onCollectOne: () => void;
  onClose: () => void;
};

export function useLootBagControls({
  isOpen,
  onCollectAll,
  onCollectOne,
  onClose,
}: Params) {
  const { pushControls } = useGameControls();
  const { playSelect, playClose } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedIndexRef = useLatestRef(selectedIndex);
  const onCollectAllRef = useLatestRef(onCollectAll);
  const onCollectOneRef = useLatestRef(onCollectOne);
  const onCloseRef = useLatestRef(onClose);
  const playSelectRef = useLatestRef(playSelect);
  const playCloseRef = useLatestRef(playClose);

  useEffect(() => {
    setSelectedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onUp: () => {
        setSelectedIndex((prev) => (prev <= 0 ? 2 : prev - 1));
        return true;
      },

      onDown: () => {
        setSelectedIndex((prev) => (prev >= 2 ? 0 : prev + 1));
        return true;
      },

      onConfirm: () => {
        const idx = selectedIndexRef.current;
        if (idx === 0) {
          playSelectRef.current();
          onCollectAllRef.current();
        } else if (idx === 1) {
          playSelectRef.current();
          onCollectOneRef.current();
        } else {
          playCloseRef.current();
          onCloseRef.current();
        }
        return true;
      },

      onCancel: () => {
        playCloseRef.current();
        onCloseRef.current();
        return true;
      },

      blockGlobalOpen: true,
    };

    const remove = pushControls(controls);
    return remove;
  }, [
    isOpen,
    pushControls,
    selectedIndexRef,
    onCollectAllRef,
    onCollectOneRef,
    onCloseRef,
    playSelectRef,
    playCloseRef,
  ]);

  return { selectedIndex };
}
