import type { RefObject } from "react";
import {
  PROFESSION_WEAPON_TIERS,
  type ProfessionWeaponConfig,
} from "@/data/professions/weapons";
import { TierItem } from "../TierItem";
import styles from "./styles.module.css";

type Props = {
  config: ProfessionWeaponConfig;
  selectedIndex: number;
  isTierOwned: (index: number) => boolean;
  highestOwned: number;
  listRef: RefObject<HTMLDivElement | null>;
};

export function TierList({
  config,
  selectedIndex,
  isTierOwned,
  highestOwned,
  listRef,
}: Props) {
  return (
    <div className={styles.tierList} ref={listRef}>
      {PROFESSION_WEAPON_TIERS.map((tier, index) => (
        <TierItem
          key={tier.id}
          tier={tier}
          baseName={config.baseName}
          selected={index === selectedIndex}
          owned={isTierOwned(index)}
          maxOwned={index <= highestOwned}
        />
      ))}
    </div>
  );
}
