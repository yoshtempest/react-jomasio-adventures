import styles from "./styles.module.css";

type Props = {
  hp: number;
  maxHp?: number;
  reversed?: boolean;
};

export function HealthBar({ hp, maxHp = 100, reversed = false }: Props) {
  const percentage = Math.max(0, Math.min(100, (hp / maxHp) * 100));

  function getBackgroundColor() {
    if (percentage <= 30) {
      return "linear-gradient(90deg, hsl(0, 100%, 88%) 0%, hsl(0, 95%, 65%) 40%, hsl(350, 90%, 52%) 100%)";
    } else if (percentage <= 70) {
      return "linear-gradient(90deg, hsl(40, 100%, 90%) 0%, hsl(35, 100%, 68%) 40%, hsl(20, 82%, 70%) 100%)";
    } else {
      return "linear-gradient(90deg, hsl(180, 100%, 88%) 0%, hsl(180, 100%, 65%) 40%, hsl(175, 100%, 52%) 70%, hsl(147, 68%, 49%) 100%)";
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
