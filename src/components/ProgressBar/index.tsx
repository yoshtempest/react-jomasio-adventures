import type { CSSProperties } from "react";
import styles from "./styles.module.css";

type ProgressBarProps = {
  value: number;
  max: number;
  height?: number | string;
  color?: string;
  label?: string;
  showText?: boolean;
  className?: string;
  fillClassName?: string;
  barStyle?: CSSProperties;
};

export function ProgressBar({
  value,
  max,
  height = 6,
  color,
  label,
  showText = false,
  className,
  fillClassName,
  barStyle,
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div
      className={`${styles.bar} ${className ?? ""}`}
      style={{ height, ...barStyle }}
    >
      {label && <span className={styles.label}>{label}</span>}
      <div
        className={`${styles.fill} ${fillClassName ?? ""}`}
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
