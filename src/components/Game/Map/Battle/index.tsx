import type { BattleMapConfig } from "@/utils/types/maps/battle";
import { TILE_COLORS } from "@/data/battle/tileColors";
import { ProjectileConstants } from "@/data/projectile";

type Props = {
  map: BattleMapConfig;
};

export function BattleMap({ map }: Props) {
  const scaleX = window.innerWidth / ProjectileConstants.MAP_WIDTH;
  const scaleY = window.innerHeight / ProjectileConstants.MAP_HEIGHT;

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
