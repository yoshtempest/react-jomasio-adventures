import { playerPath } from "@/utils/paths";
import { ProjectileConstants } from "@/data/projectile";
import styles from "./styles.module.css";

type Props = {
  active: boolean;
  variant: string | null;
  playerX: number;
  playerY: number;
};

export function BlackFlashAnimation({
  active,
  variant,
  playerX,
  playerY,
}: Props) {
  if (!active || !variant) return null;

  const scaleX = window.innerWidth / ProjectileConstants.MAP_WIDTH;
  const scaleY = window.innerHeight / ProjectileConstants.MAP_HEIGHT;

  const src = playerPath(`/riquelme/inFight/attacks/blackFlash/${variant}.svg`);

  return (
    <img
      src={src}
      className={styles.overlay}
      style={{
        left: playerX * scaleX,
        top: playerY * scaleY,
        transform: "translate(-50%, -100%)",
      }}
    />
  );
}