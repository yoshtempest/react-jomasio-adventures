type Props = {
  children: React.ReactNode;
  TILE_SIZE: number;
  offsetX: number;
  offsetY: number;
  cols: number;
  rows: number;
};

export function GameMap({
  children,
  TILE_SIZE,
  offsetX,
  offsetY,
  cols,
  rows,
}: Props) {
  return (
    <div
      style={{
        position: "absolute",
        left: offsetX,
        top: offsetY,
        width: cols * TILE_SIZE,
        height: rows * TILE_SIZE,
      }}
    >
      {children}
    </div>
  );
}