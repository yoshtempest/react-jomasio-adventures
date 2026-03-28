type Direction = "up" | "down" | "left" | "right";

type Props = {
  direction: Direction;
  gridX: number;
  gridY: number;
  TILE_SIZE: number;
  PLAYER_SIZE: number;
};

export function Player({
  direction,
  gridX,
  gridY,
  TILE_SIZE,
  PLAYER_SIZE,
}: Props) {
  const src = `/src/assets/player/movement/${direction}.svg`;

  return (
    <img
      src={src}
      style={{
        position: "absolute",
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        left: gridX * TILE_SIZE - 11,
        top: gridY * TILE_SIZE,
        transform: "translate(-10%, -20%)",
        zIndex: 10,
      }}
    />
  );
}