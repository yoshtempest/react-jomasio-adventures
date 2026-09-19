import styles from "./styles.module.css";

type Props = {
  gauge: number;
};

const SPECIAL_LIMIT = 100;

/** Barra do special do Alfa (preenchida 1% a cada 100ms durante a fuga). */
export function AlfaSpecialGauge({ gauge }: Props) {
  const pct = Math.max(0, Math.min(100, (gauge / SPECIAL_LIMIT) * 100));
  const ready = pct >= 100;
  const barColor = ready ? "#ff4488" : "#ffaa00";

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
        {ready ? "special pronta!" : `special ${Math.round(pct)}%`}
      </div>
    </div>
  );
}