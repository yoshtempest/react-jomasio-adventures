import { useRef, useEffect } from "react";
import { useProfessionDetail } from "@/hooks/menu/professions/useProfessionDetail";
import type { ProfessionWeaponConfig } from "@/data/professions/weapons";
import type { ProfessionInfo } from "@/utils/types/player/profession";
import type { InventoryItem } from "@/utils/types/player/inventory";
import { TierList } from "./TierList";
import { RankDetails } from "./RankDetails";
import styles from "./styles.module.css";

type Props = {
  profession: ProfessionInfo;
  config: ProfessionWeaponConfig;
  items: InventoryItem[];
  onClose: () => void;
};

export function ProfessionDetail({
  profession,
  config,
  items,
  onClose,
}: Props) {
  const {
    selectedIndex,
    message,
    isTierOwned,
    getHighestOwnedTierIndex,
    canCraftTier,
  } = useProfessionDetail({ profession, config, onClose });

  const listRef = useRef<HTMLDivElement | null>(null);
  const highestOwned = getHighestOwnedTierIndex();

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[selectedIndex] as
      HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedIndex]);

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>
        <span>{config.baseName}</span>
        <button className={styles.backBtn} onClick={onClose}>
          ← Voltar
        </button>
      </h3>

      <div className={styles.panels}>
        <div className={styles.leftPanel}>
          <TierList
            config={config}
            selectedIndex={selectedIndex}
            isTierOwned={isTierOwned}
            highestOwned={highestOwned}
            listRef={listRef}
          />
        </div>

        <RankDetails
          profession={profession}
          config={config}
          selectedIndex={selectedIndex}
          isTierOwned={isTierOwned}
          canCraftTier={canCraftTier}
          items={items}
        />
      </div>

      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
}
