import { resolveBattleSprite } from "@/utils/paths";
import { ProjectileConstants } from "@/data/projectile";
import { BLINK_AFTERIMAGE_MS } from "@/gameRules/battle/cursedEnergy";
import type { BlinkVisual } from "@/hooks/battle/player/characters/natsuki/useBlinkAnimation";
import styles from "./styles.module.css";

type Props = {
  visual: BlinkVisual;
  PLAYER_SIZE: number;
  character: CharacterId;
};

/**
 * Silhueta preta deixada no local de origem do blink do riquelme. Sobe junto
 * com o escurecimento do personagem nos primeiros 50ms, segue visível depois
 * do teleporte e some ao final de `BLINK_AFTERIMAGE_MS`.
 */
export function BlinkAfterimage({ visual, PLAYER_SIZE, character }: Props) {
  const scaleX = window.innerWidth / ProjectileConstants.MAP_WIDTH;
  const scaleY = window.innerHeight / ProjectileConstants.MAP_HEIGHT;
  const SCALE = PLAYER_SIZE / ProjectileConstants.MAP_HEIGHT;
  const WIDTH = (ProjectileConstants.MAP_WIDTH * SCALE) / 1.5;
  const HEIGHT = (ProjectileConstants.MAP_HEIGHT * SCALE) / 1.5;
  const src = resolveBattleSprite(character, visual.state);

  return (
    <div
      className={styles.afterimage}
      style={{
        position: "absolute",
        width: WIDTH,
        height: HEIGHT,
        left: visual.originX * scaleX,
        top: visual.originY * scaleY,
        transform: "translate(-50%, -100%)",
      }}
    >
      <img
        src={src}
        style={{
          animationDuration: `${BLINK_AFTERIMAGE_MS}ms`,
          position: "absolute",
          width: "auto",
          height: "100%",
          left: "50%",
          bottom: 0,
          transform: `translateX(-50%) scaleX(${
            visual.direction === "left" ? -1 : 1
          })`,
          transformOrigin: "bottom center",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
