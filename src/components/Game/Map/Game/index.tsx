type Props = {
  children: React.ReactNode;
  TILE_SIZE: number;
  cols: number;
  rows: number;
  cameraX?: number;
  cameraY?: number;
  backgroundUrl?: string;
};

export function GameMap({
  children,
  TILE_SIZE,
  cols,
  rows,
  cameraX = 0,
  cameraY = 0,
  backgroundUrl,
}: Props) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: cols * TILE_SIZE,
        height: rows * TILE_SIZE,
        transform: `translate(${-cameraX}px, ${-cameraY}px)`,
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </div>
  );
}
