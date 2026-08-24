import type { ReactNode } from "react";
import styles from "./styles.module.css";

type StatItemProps = {
  label: ReactNode;
  value: ReactNode;
};

export function StatItem({ label, value }: StatItemProps) {
  return (
    <>
      <div className={styles.statItem}>
        <span className={styles.statLabel}>{label}</span>
        <span className={styles.statValue}>{value}</span>
      </div>
    </>
  );
}
