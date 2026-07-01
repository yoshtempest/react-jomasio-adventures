import type { ReactNode } from "react";
import styles from "./styles.module.css";

type StatRowProps = {
  label: ReactNode;
  value: ReactNode;
  progress?: number;
};

export function StatRow({
  label,
  value,
  progress,
}: StatRowProps) {
  return (
    <>
      <div className={styles.statRow}>
        <span className={styles.statLabel}>{label}</span>
        <span className={styles.statValue}>{value}</span>
      </div>

      {progress !== undefined && (
        <div className={styles.barOuter}>
          <div
            className={styles.barInner}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </>
  );
}