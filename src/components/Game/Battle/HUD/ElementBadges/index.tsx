import type { ElementType } from "@/utils/types/battle/element";
import { asset } from "@/utils/paths";
import styles from "./styles.module.css";

type Props = {
  types: readonly ElementType[];
};

export function ElementBadges({ types }: Props) {
  return (
    <span className={styles.badges}>
      {types.map((type) => (
        <img
          key={type}
          src={asset(`/assets/elementsBadges/${type.toLowerCase()}.svg`)}
          alt={type}
          title={type}
          className={styles.badge}
        />
      ))}
    </span>
  );
}
