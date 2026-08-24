import styles from "./styles.module.css";
import { ProjectileConstants } from "@/data/projectile";

type Props = {
  landingX: number;
  groundY?: number;
};

export function JumpIndicator({ landingX, groundY = 550 }: Props) {
  const scaleX = window.innerWidth / ProjectileConstants.MAP_WIDTH;
  const scaleY = window.innerHeight / ProjectileConstants.MAP_HEIGHT;

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
