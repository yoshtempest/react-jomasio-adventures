import styles from "./styles.module.css"

type StatRowProps = {
  label: React.ReactNode;
  value: React.ReactNode;
};

export function StatRow({ label, value }: StatRowProps) {
  return (
    <div className={styles.statRow}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}