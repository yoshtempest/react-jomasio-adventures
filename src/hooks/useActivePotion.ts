import { useEffect, useState, useRef } from "react";
import { ITEMS } from "@/data/items";
import { getActivePotionId, getXpBuffTimeLeft } from "@/utils/buffs/xpBuff";

type ActivePotionInfo = {
  image: string;
  name: string;
  remainingMs: number;
};

export function useActivePotion(): ActivePotionInfo | null {
  const [info, setInfo] = useState<ActivePotionInfo | null>(null);
  const infoRef = useRef(info);
  infoRef.current = info;

  useEffect(() => {
    function tick() {
      const potionId = getActivePotionId();
      if (!potionId) {
        if (infoRef.current !== null) {
          setInfo(null);
        }
        return;
      }
      const item = ITEMS[potionId as ItemId];
      if (!item) return;
      setInfo({
        image: item.image as string,
        name: item.name as string,
        remainingMs: getXpBuffTimeLeft(),
      });
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return info;
}
