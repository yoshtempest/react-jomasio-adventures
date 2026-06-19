import { asset } from "@/utils/asset";

type Props = {
  gridX: number;
  gridY: number;
  TILE_SIZE: number;
  src: string;
};

export function Plate({ gridX, gridY, TILE_SIZE, src }: Props) {
  return (
    <img
      src={asset(src)}
      alt=""
      style={{
        position: "absolute",
        width: TILE_SIZE,
        height: TILE_SIZE,
        left: gridX * TILE_SIZE,
        top: gridY * TILE_SIZE,
        zIndex: 5,
        pointerEvents: "none",
      }}
    />
  );
}
