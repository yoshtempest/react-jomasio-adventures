type Props = {
  gridX: number;
  gridY: number;
  TILE_SIZE: number;
  src: string;
};

export function NPC({ gridX, gridY, TILE_SIZE, src }: Props) {
  return (
    <img
      src={src}
      style={{
        position: "absolute",
        width: TILE_SIZE * 2,
        height: TILE_SIZE * 2,
        left: gridX * TILE_SIZE - 30,
        top: gridY * TILE_SIZE,
        transform: "translate(-10%, -20%)",
        zIndex: 9,
      }}
    />
  );
}