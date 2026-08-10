import { resolveAsset } from "@/utils/paths";
import { getEntityZIndex } from "@/utils/entityDepth";

type Props = {
  gridX: number;
  gridY: number;
  TILE_SIZE: number;
  src: string;
};

export function NPC({ gridX, gridY, TILE_SIZE, src }: Props) {
  return (
    <img
      src={resolveAsset(src)}
      style={{
        position: "absolute",
        width: TILE_SIZE * 1.7,
        height: TILE_SIZE * 1.7,
        left: gridX * TILE_SIZE - 40,
        top: gridY * TILE_SIZE - 20,
        zIndex: getEntityZIndex(gridY),
      }}
    />
  );
}
