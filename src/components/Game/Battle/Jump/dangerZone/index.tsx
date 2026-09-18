import styles from "./styles.module.css";
import { ProjectileConstants } from "@/data/projectile";
import { getViewportSize } from "@/utils/viewport";
import {
  JUMP_CENTER_RADIUS,
  JUMP_EDGE_RADIUS,
  JUMP_GROUND_Y,
} from "@/services/npc/attacks/slimita/state";

type Props = {
  landingX: number;
};

export function JumpDangerZone({ landingX }: Props) {
  const scaleX = getViewportSize().width / ProjectileConstants.MAP_WIDTH;
  const scaleY = getViewportSize().height / ProjectileConstants.MAP_HEIGHT;

  const zoneStyle = (radius: number) => ({
    left: landingX * scaleX,
    top: JUMP_GROUND_Y * scaleY,
    width: radius * 2 * scaleX,
    height: radius * 2 * scaleX * 0.25,
  });

  return (
    <>
      <div
        className={`${styles.zone} ${styles.edge}`}
        style={zoneStyle(JUMP_EDGE_RADIUS)}
      />
      <div
        className={`${styles.zone} ${styles.center}`}
        style={zoneStyle(JUMP_CENTER_RADIUS)}
      />
    </>
  );
}
