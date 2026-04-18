import { useEffect, useState } from "react";
import type { Gender } from "@/utils/types/tutorial";

export function useGenderChoice(
  isActive: boolean,
  onSelect: (gender: Gender) => void
) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    function handleKeyDown(e: KeyboardEvent) {
      e.stopPropagation();

      if (e.key === "d" || e.key === "ArrowRight") setIndex(1);
      if (e.key === "a" || e.key === "ArrowLeft") setIndex(0);

      if (e.key === "l" || e.key === "Enter") {
        onSelect(index === 0 ? "marcelo" : "eduarda");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, index]);

  return {
    index,
    setIndex,
  };
}