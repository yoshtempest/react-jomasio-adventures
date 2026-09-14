import { useRef } from "react";
import type { CollisionParams } from "@/utils/types/battle/collision";

export function useBattleCollisionRef() {
  return useRef<CollisionParams>({
    map: null,
    TILE_SIZE: 0,
  });
}
