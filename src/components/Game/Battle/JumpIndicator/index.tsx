import styles from "./styles.module.css";

type Props = {
  landingX: number;
  groundY: number;
  scaleX: number;
  scaleY: number;
};

export function JumpIndicator({ landingX, groundY, scaleX, scaleY }: Props) {
  return (
    <div
      className={styles.zone}
      style={{
        left: landingX * scaleX - 60,
        top: groundY * scaleY - 120,
      }}
    >
      <span className={styles.icon}>!</span>
    </div>
  );
}
