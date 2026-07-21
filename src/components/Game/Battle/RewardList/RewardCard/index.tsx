import type { ReactNode } from "react";
import styles from "./styles.module.css";

type StatItemProps = {
  label: ReactNode;
  value: ReactNode;
};

export function RewardCard({ label, value }: StatItemProps) {
  return (
    <>
      <div className={styles.rewardCard}>
        <span className={styles.rewardLabel}>{label}: </span>
        <span className={styles.rewardValue}>{value}</span>
      </div>
    </>
  );
}
