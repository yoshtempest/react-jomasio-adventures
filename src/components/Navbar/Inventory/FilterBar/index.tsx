import { FILTER_LABELS } from "@/data/inventory/labels";
import styles from "../styles.module.css";

type Props = {
  filterType: string;
  filterFocused: boolean;
  onFilterChange: (type: string) => void;
};

export function FilterBar({ filterType, filterFocused, onFilterChange }: Props) {
  return (
    <div className={styles.filterBar}>
      {FILTER_LABELS.map((f) => (
        <button
          key={f.type}
          className={`${styles.filterButton} ${
            filterType === f.type ? styles.filterButtonActive : ""
          } ${filterFocused && filterType === f.type ? styles.filterButtonFocused : ""}`}
          onClick={() => onFilterChange(f.type)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
