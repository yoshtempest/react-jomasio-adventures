import styles from "./styles.module.css";

type ProgressBarProps = {
  value: number;
  max: number;
  height?: number;
  color?: string;
  label?: string;
  showText?: boolean;
  className?: string;
};

export function ProgressBar({
  value,
  max,
  height = 12,
  color,
  label,
  showText = false,
  className,
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div
      className={`${styles.bar} ${className ?? ""}`}
      style={{ height }}
    >
      {label && <span className={styles.label}>{label}</span>}
      <div
        className={styles.fill}
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
      {showText && (
        <span className={styles.text}>
          {value}/{max}
        </span>
      )}
    </div>
  );
}
