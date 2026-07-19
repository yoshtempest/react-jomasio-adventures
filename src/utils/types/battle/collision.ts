import type { BattleMapConfig } from "@/utils/types/maps/battle";

export type CollisionParams = {
  map: BattleMapConfig | null;
  TILE_SIZE: number;
  scaleX: number;
  scaleY: number;
};
