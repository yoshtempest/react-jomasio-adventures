import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
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
  const { pushControls, popControls } = useGameControls();
  const { playMove, playSelect } = useMenuSFX();

  const selectedSlotRef = useRef(selectedSlot);
  selectedSlotRef.current = selectedSlot;
  const solvedRef = useRef(solved);
  solvedRef.current = solved;
  const onSolvedRef = useRef(onSolved);
  onSolvedRef.current = onSolved;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const playSelectRef = useRef(playSelect);
  playSelectRef.current = playSelect;

  useEffect(() => {
    if (state.every((s) => s === 0)) {
      setSolved(true);
    }
  }, [state]);

  function cycleSlot(slotIndex: number, delta: number) {
    setState((prev) => {
      const next: PuzzleState = [...prev];
      next[slotIndex] = ((next[slotIndex] + delta) % 4 + 4) % 4;
      return next;
    });
  }

  const cycleSlotRef = useRef(cycleSlot);
  cycleSlotRef.current = cycleSlot;

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

    pushControls(controls);
    return () => popControls();
  }, [isOpen, pushControls, popControls]);

  return {
    state,
    selectedSlot,
    solved,
  };
}