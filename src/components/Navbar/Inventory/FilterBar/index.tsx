import { FILTER_LABELS } from "@/data/inventory/labels";
import styles from "./styles.module.css";

type Props = {
  filterType: string;
  filterFocused: boolean;
  onFilterChange: (type: string) => void;
};

export function FilterBar({ filterType, filterFocused, onFilterChange }: Props) {
  return (
    <div className={styles.container}>
      {FILTER_LABELS.map((f) => (
        <button
          key={f.type}
          className={`${styles.button} ${
            filterType === f.type ? styles.buttonActive : ""
          } ${filterFocused && filterType === f.type ? styles.buttonFocused : ""}`}
          onClick={() => onFilterChange(f.type)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
