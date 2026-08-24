import { playerPath } from "@/utils/paths";
import { EXPLORE_MOVE_INTERVAL } from "@/gameRules/movement/explore";
import { HEIGHT_STEP_OFFSET } from "@/gameRules/movement/levels";
import { getEntityZIndex } from "@/utils/entityDepth";

type Props = {
  character: CharacterId;
  direction: Direction;
  gridX: number;
  gridY: number;
  height?: number;
  TILE_SIZE: number;
  PLAYER_SIZE: number;
  hasPeru?: boolean;
  moving?: boolean;
};

export function Player({
  character,
  direction,
  gridX,
  gridY,
  height = 0,
  TILE_SIZE,
  PLAYER_SIZE,
  hasPeru,
  moving,
}: Props) {
  const spriteDirection = direction === "left" ? "right" : direction;
  const spriteName = moving
    ? `moving${spriteDirection.charAt(0).toUpperCase() + spriteDirection.slice(1)}`
    : spriteDirection;

  const spritePath = hasPeru
    ? `/${character}/movement/withPeru/${spriteName}.svg`
    : `/${character}/movement/${spriteName}.svg`;

  const src = playerPath(spritePath);

  return (
    <img
      src={src}
      style={{
        position: "absolute",
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        objectFit: "contain",
        left: gridX * TILE_SIZE - 11,
        top: gridY * TILE_SIZE - height * TILE_SIZE * HEIGHT_STEP_OFFSET,
        transform: `translate(-10%, -20%) scaleX(${direction === "left" ? -1 : 1})`,
        zIndex: getEntityZIndex(gridY),
        transition: `left ${EXPLORE_MOVE_INTERVAL}ms, top ${EXPLORE_MOVE_INTERVAL}ms`,
      }}
    />
  );
}
