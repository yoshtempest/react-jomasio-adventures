import { FILTER_LABELS } from "@/data/inventory/labels";
import styles from "./styles.module.css";
import { asset } from "@/utils/paths";

type Props = {
  filterType: string;
  filterFocused: boolean;
  onFilterChange: (type: string) => void;
};

export function FilterBar({
  filterType,
  filterFocused,
  onFilterChange,
}: Props) {
  return (
    <div className={`${styles.container} hideScrollbar`}>
      {FILTER_LABELS.map((f) => (
        <button
          key={f.type}
          className={`${styles.button} ${
            filterType === f.type ? styles.buttonActive : ""
          } ${filterFocused && filterType === f.type ? styles.buttonFocused : ""}`}
          onClick={() => onFilterChange(f.type)}
        >
          <img src={asset(`${f.src}`)} className={styles.image} />
          {f.label}
        </button>
      ))}
    </div>
  );
}
