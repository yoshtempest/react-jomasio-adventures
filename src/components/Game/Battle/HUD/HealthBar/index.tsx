import styles from "./styles.module.css"

type Props = {
  hp: number;
  maxHp?: number;
  reversed?: boolean;
};

export function HealthBar({ hp, maxHp = 100, reversed = false }: Props) {
  const percentage = Math.max(0, Math.min(100, (hp / maxHp) * 100));

  function getBackgroundColor() {
    if (percentage <= 30) {
      return "red";
    } else if (percentage <= 70) {
      return "orange";
    } else {
      return "limegreen";
    }
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.fill}
        style={{
          width: `${percentage}%`,
          background: getBackgroundColor(),
          ...(reversed ? { marginLeft: `${100 - percentage}%` } : {}),
        }}
      />
      <div className={styles.text}>
        {Math.round(hp)} / {maxHp}
      </div>
    </div>
  );
}
