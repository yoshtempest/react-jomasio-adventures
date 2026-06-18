import styles from "./styles.module.css";

type Props = {
  landingX: number;
  groundY: number;
};

export function JumpIndicator({ landingX, groundY }: Props) {
  return (
    <div
      className={styles.zone}
      style={{
        left: landingX - 60,
        top: groundY - 80,
      }}
    >
      <span className={styles.icon}>!</span>
    </div>
  );
}
