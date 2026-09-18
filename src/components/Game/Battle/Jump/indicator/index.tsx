import styles from "./styles.module.css";
import { ProjectileConstants } from "@/data/projectile";
import { getViewportSize } from "@/utils/viewport";

type Props = {
  landingX: number;
  groundY?: number;
};

export function JumpIndicator({ landingX, groundY = 550 }: Props) {
  const scaleX = getViewportSize().width / ProjectileConstants.MAP_WIDTH;
  const scaleY = getViewportSize().height / ProjectileConstants.MAP_HEIGHT;

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
