import styles from "./styles.module.css";

type Props = {
  remainingMs: number;
};

export function VastolordTimer({ remainingMs }: Props) {
  const seconds = Math.max(0, remainingMs / 1000).toFixed(1);

  return (
    <div className={styles.container}>
      <span className={styles.label}>FORMA VASTOLORD</span>
      <span className={styles.time}>{seconds}s</span>
    </div>
  );
}
