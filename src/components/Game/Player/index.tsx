import { asset } from "@/utils/asset";

type Props = {
  character: CharacterId;
  direction: Direction;
  gridX: number;
  gridY: number;
  TILE_SIZE: number;
  PLAYER_SIZE: number;
};

export function Player({
  character,
  direction,
  gridX,
  gridY,
  TILE_SIZE,
  PLAYER_SIZE,
}: Props) {
  const spriteDirection = direction === "left" ? "right" : direction;

  const src = asset(
    `assets/player/${character}/movement/${spriteDirection}.svg`
  );

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
      }}
    />
  );
}