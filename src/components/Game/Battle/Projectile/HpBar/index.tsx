import styles from "./styles.module.css";

export default function HpBar({
  x,
  y,
  scaleX,
  scaleY,
  hp,
  maxHp,
}: {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  hp: number;
  maxHp: number;
}) {
  const pct = Math.max(0, Math.min(1, hp / maxHp));
  return (
    <div className={styles.hpBar} style={{ left: x * scaleX, top: y * scaleY }}>
      <div className={styles.hpBarFill} style={{ width: `${pct * 100}%` }} />
    </div>
  );
}