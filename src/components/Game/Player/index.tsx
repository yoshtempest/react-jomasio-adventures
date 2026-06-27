import { asset } from "@/utils/asset";

type Props = {
  character: CharacterId;
  direction: Direction;
  gridX: number;
  gridY: number;
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
  TILE_SIZE,
  PLAYER_SIZE,
  hasPeru,
  moving,
}: Props) {
  const spriteDirection = direction === "left" ? "right" : direction;
  const spriteName = moving ? `moving${spriteDirection.charAt(0).toUpperCase() + spriteDirection.slice(1)}` : spriteDirection;

  const spritePath = hasPeru
    ? `assets/player/${character}/movement/withPeru/${spriteName}.svg`
    : `assets/player/${character}/movement/${spriteName}.svg`;

  const src = asset(spritePath);

  return (
    <img
      src={src}
      style={{
        position: "absolute",
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        objectFit: "contain",
        left: gridX * TILE_SIZE - 11,
        top: gridY * TILE_SIZE,
        transform: `translate(-10%, -20%) scaleX(${direction === "left" ? -1 : 1})`,
        zIndex: 10,
        transition: "left 0.08s, top 0.08s",
      }}
    />
  );
}
