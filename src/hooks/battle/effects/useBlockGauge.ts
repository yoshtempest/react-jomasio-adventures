import { useState, useEffect } from "react";
import { getBlockLimit } from "@/gameRules/battle/equipment";

export function useBlockGauge(level: number, totalArmor: number) {
  const blockLimit = getBlockLimit(level, totalArmor);
  const [blockGauge, setBlockGauge] = useState(blockLimit);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockGauge((g) => Math.min(blockLimit, g + 1));
    }, 100);
    return () => clearInterval(interval);
  }, [blockLimit]);

  const resetBlockGauge = () => setBlockGauge(blockLimit);

  return { blockGauge, setBlockGauge, blockLimit, resetBlockGauge };
}
