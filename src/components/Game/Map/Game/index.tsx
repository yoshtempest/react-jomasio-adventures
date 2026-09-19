type Props = {
  children: React.ReactNode;
  TILE_SIZE: number;
  cols: number;
  rows: number;
  cameraX?: number;
  cameraY?: number;
  backgroundUrl?: string;
  backgroundSize?: string;
  /** Fator de zoom aplicado ao mundo (1 = sem zoom). */
  zoom?: number;
  /** Ponto do mundo (em px) que deve permanecer fixo durante o zoom. */
  focusX?: number;
  focusY?: number;
};

export function GameMap({
  children,
  TILE_SIZE,
  cols,
  rows,
  cameraX = 0,
  cameraY = 0,
  backgroundUrl,
  backgroundSize = "cover",
  zoom = 1,
  focusX,
  focusY,
}: Props) {
  const anchorX =
    focusX != null ? focusX - cameraX : 0;
  const anchorY =
    focusY != null ? focusY - cameraY : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: cols * TILE_SIZE,
        height: rows * TILE_SIZE,
        transform: `translate(${anchorX}px, ${anchorY}px) scale(${zoom}) translate(${-anchorX}px, ${-anchorY}px) translate(${-cameraX}px, ${-cameraY}px)`,
        transformOrigin: "0 0",
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundSize,
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </div>
  );
}
