import type { RefObject, Dispatch, SetStateAction } from "react";
import type { DefeatMenuSelection } from "@/utils/types/battle/defeat";

type View = "menu" | "characterSelect";
export function menuCycleHandler(
  viewRef: RefObject<View>,
  playMoveRef: RefObject<() => void>,
  setMenuSelectionRef: RefObject<Dispatch<SetStateAction<DefeatMenuSelection>>>,
  table: Record<DefeatMenuSelection, DefeatMenuSelection>,
) {
  return () => {
    if (viewRef.current !== "menu") return;
    playMoveRef.current();
    setMenuSelectionRef.current((prev) => table[prev]);
  };
}