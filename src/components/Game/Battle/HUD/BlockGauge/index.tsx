import styles from "./styles.module.css";

type Props = {
  blockGauge: number;
  blockLimit: number;
};

export function BlockGauge({ blockGauge, blockLimit }: Props) {
  const pct = blockLimit > 0 ? (blockGauge / blockLimit) * 100 : 0;
  const barColor = pct > 50 ? "#4488ff" : pct > 20 ? "#ffaa00" : "#ff4444";

  return (
    <div className={styles.colorEffect}>
      <div
        className={styles.fill}
        style={{
          width: `${pct}%`,
          background: barColor,
        }}
      />
      <div className={styles.text}>
        BLOCK {blockGauge}/{blockLimit}
      </div>
    </div>
  );
}
