import type { RefObject } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useGameControlsLayer } from "@/hooks/game/useGameControlsLayer";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";

const SCROLL_STEP = 100;

export function useVictoryKeyboard(
  isVisible: boolean,
  onContinue: () => void,
  scrollRef: RefObject<HTMLDivElement | null>,
) {
  const onContinueRef = useLatestRef(onContinue);

  const { playMove } = useMenuSFX();
  const playMoveRef = useLatestRef(playMove);

  useGameControlsLayer(
    isVisible
      ? {
          onUp: () => {
            const el = scrollRef.current;
            if (!el || el.scrollTop <= 0) return true;
            playMoveRef.current();
            el.scrollBy({ top: -SCROLL_STEP, behavior: "smooth" });
            return true;
          },
          onDown: () => {
            const el = scrollRef.current;
            if (!el || el.scrollTop >= el.scrollHeight - el.clientHeight)
              return true;
            playMoveRef.current();
            el.scrollBy({ top: SCROLL_STEP, behavior: "smooth" });
            return true;
          },
          onConfirm: () => {
            onContinueRef.current();
            return true;
          },
          blockGlobalOpen: true,
        }
      : null,
    [isVisible],
  );
}
