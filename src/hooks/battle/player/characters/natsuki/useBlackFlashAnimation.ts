import { useState, useCallback, useRef } from "react";

const BLACK_FLASH_VARIANTS = ["one", "two"] as const;
const FLASH_DURATION = 300;
export const BLACK_FLASH_TIME_SCALE = 0.5;

export function useBlackFlashAnimation() {
  const [blackFlash, setBlackFlash] = useState<{
    active: boolean;
    variant: string | null;
  }>({ active: false, variant: null });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const variant =
      BLACK_FLASH_VARIANTS[
        Math.floor(Math.random() * BLACK_FLASH_VARIANTS.length)
      ]!;
    setBlackFlash({ active: true, variant });

    timerRef.current = setTimeout(
      () => setBlackFlash({ active: false, variant: null }),
      FLASH_DURATION,
    );
  }, []);

  const blackFlashVariant = blackFlash.active ? blackFlash.variant : null;

  return {
    blackFlashActive: blackFlash.active,
    blackFlashVariant,
    triggerBlackFlash: trigger,
  };
}
