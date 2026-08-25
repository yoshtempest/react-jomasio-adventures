import { useEffect, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";

type Params = {
  isOpen: boolean;
  maxQty: number;
  onDrop: (qty: number) => void;
  onClose: () => void;
};

export function useDropControls({ isOpen, maxQty, onDrop, onClose }: Params) {
  const { pushControls } = useGameControls();
  const { playMove, playSelect, playClose } = useMenuSFX();

  const [qty, setQty] = useState(1);

  const qtyRef = useLatestRef(qty);
  const maxQtyRef = useLatestRef(maxQty);
  const onDropRef = useLatestRef(onDrop);
  const onCloseRef = useLatestRef(onClose);
  const playMoveRef = useLatestRef(playMove);
  const playSelectRef = useLatestRef(playSelect);
  const playCloseRef = useLatestRef(playClose);

  useEffect(() => {
    setQty(1);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onUp: () => {
        playMoveRef.current();
        setQty((prev) => Math.min(prev + 1, maxQtyRef.current));
        return true;
      },

      onDown: () => {
        playMoveRef.current();
        setQty((prev) => Math.max(prev - 1, 1));
        return true;
      },

      onConfirm: () => {
        playSelectRef.current();
        onDropRef.current(qtyRef.current);
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
    maxQtyRef,
    onDropRef,
    onCloseRef,
    playMoveRef,
    playSelectRef,
    playCloseRef,
    qtyRef,
  ]);

  return { qty, setQty };
}
