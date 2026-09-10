import { RANK_COLORS, RANK_LABELS } from "@/data/equipment/definitions";
import type { ProfessionWeaponTier } from "@/data/professions/weapons";
import styles from "./styles.module.css";

type Props = {
  tier: ProfessionWeaponTier;
  baseName: string;
  selected: boolean;
  owned: boolean;
  maxOwned: boolean;
};

export function TierItem({ tier, baseName, selected, owned, maxOwned }: Props) {
  const color = RANK_COLORS[tier.rank];

  return (
    <div
      className={`${styles.tierItem} ${selected ? styles.tierSelected : ""}`}
      style={{ borderLeftColor: maxOwned ? color : "transparent" }}
    >
      <div
        className={styles.tierDot}
        style={{ background: maxOwned ? color : undefined }}
      />
      <div className={styles.tierInfo}>
        <span
          className={styles.tierName}
          style={{ color: maxOwned ? color : undefined }}
        >
          {baseName} {tier.label}
        </span>
        <span className={styles.tierRank}>
          Ranque {RANK_LABELS[tier.rank]}
        </span>
      </div>
      {owned && <span className={styles.ownedBadge}>★</span>}
    </div>
  );
}
