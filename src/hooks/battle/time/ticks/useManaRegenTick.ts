import { useEffect } from "react";
import { ONE_THOUSAND_MS } from "@/data/ms";
import { MANA_REGEN_PER_SECOND } from "@/gameRules/battle/mana";
import type { BattleManaApi } from "@/contexts/BattleManaContext";

export function useManaRegenTick(
  battleManaRef: React.RefObject<BattleManaApi | null>,
  isEnding: React.RefObject<boolean>,
  isMenuRef?: React.RefObject<boolean>,
  enabled = true,
  isPausedRef?: React.RefObject<boolean>,
) {
  useEffect(() => {
    if (!enabled || !battleManaRef.current) return;
    const interval = setInterval(() => {
      if (isEnding.current || isMenuRef?.current || isPausedRef?.current)
        return;
      battleManaRef.current?.restoreMana(MANA_REGEN_PER_SECOND);
    }, ONE_THOUSAND_MS);
    return () => clearInterval(interval);
  }, [battleManaRef, isEnding, isMenuRef, enabled, isPausedRef]);
}
