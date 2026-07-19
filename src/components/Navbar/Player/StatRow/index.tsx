import type { ReactNode } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import styles from "./styles.module.css";

type StatRowProps = {
  label: ReactNode;
  value: ReactNode;
  progress?: number;
};

export function StatRow({ label, value, progress }: StatRowProps) {
  return (
    <>
      <div className={styles.statRow}>
        <span className={styles.statLabel}>{label}</span>
        <span className={styles.statValue}>{value}</span>
      </div>

      {progress !== undefined && (
        <ProgressBar
          value={progress}
          max={100}
          className={styles.barOuter}
          color="var(--accent-color)"
        />
      )}
    </>
  );
}
