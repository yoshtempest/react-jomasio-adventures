import type { BattleMapConfig } from "@/utils/types/maps/battle";
import { TILE_COLORS } from "@/data/battle/tileColors";

type Props = {
  map: BattleMapConfig;
  scaleX: number;
  scaleY: number;
};

export function BattleMap({ map, scaleX, scaleY }: Props) {
  return (
    <>
      {map.obstacles.map((ob, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: ob.x * scaleX,
            top: ob.y * scaleY,
            width: ob.width * scaleX,
            height: ob.height * scaleY,
            backgroundColor: TILE_COLORS[ob.type] || "#888",
            border: "1px solid rgba(0,0,0,0.3)",
            boxSizing: "border-box",
            zIndex: 1,
          }}
        />
      ))}
    </>
  );
}
