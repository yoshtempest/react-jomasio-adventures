import { useEffect, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";

export const SYMBOLS = ["Bodão", "Lupita", "Dragão", "Juju"] as const;

export type PuzzleState = [number, number, number];

const DEFAULT_STATE: PuzzleState = [1, 3, 2];

export function usePandemonyPuzzle(
  isOpen: boolean,
  onSolved: () => void,
  onClose: () => void,
) {
  const [state, setState] = useState<PuzzleState>(DEFAULT_STATE);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [solved, setSolved] = useState(false);
  const { pushControls } = useGameControls();
  const { playMove, playSelect } = useMenuSFX();

  const selectedSlotRef = useLatestRef(selectedSlot);
  const solvedRef = useLatestRef(solved);
  const onSolvedRef = useLatestRef(onSolved);
  const onCloseRef = useLatestRef(onClose);
  const playMoveRef = useLatestRef(playMove);
  const playSelectRef = useLatestRef(playSelect);

  useEffect(() => {
    if (state.every((s) => s === 0)) {
      setSolved(true);
    }
  }, [state]);

  function cycleSlot(slotIndex: number, delta: number) {
    setState((prev) => {
      const next: PuzzleState = [...prev];
      next[slotIndex] = (((next[slotIndex]! + delta) % 4) + 4) % 4;
      return next;
    });
  }

  const cycleSlotRef = useLatestRef(cycleSlot);

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onUp: () => {
        playMoveRef.current();
        setSelectedSlot((prev) => (prev > 0 ? prev - 1 : prev));
        return true;
      },

      onDown: () => {
        playMoveRef.current();
        setSelectedSlot((prev) => (prev < 2 ? prev + 1 : prev));
        return true;
      },

      onLeft: () => {
        playMoveRef.current();
        cycleSlotRef.current(selectedSlotRef.current, -1);
        return true;
      },

      onRight: () => {
        playMoveRef.current();
        cycleSlotRef.current(selectedSlotRef.current, 1);
        return true;
      },

      onConfirm: () => {
        if (solvedRef.current) {
          playSelectRef.current();
          onSolvedRef.current();
          return true;
        }
        return false;
      },

      onCancel: () => {
        playSelectRef.current();
        onCloseRef.current();
        return true;
      },

      blockGlobalOpen: true,
    };

    const remove = pushControls(controls);
    return remove;
  }, [isOpen, pushControls, cycleSlotRef, onCloseRef, onSolvedRef, playMoveRef, playSelectRef, selectedSlotRef, solvedRef]);

  return {
    state,
    selectedSlot,
    solved,
  };
}
