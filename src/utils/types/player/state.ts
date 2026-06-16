import { useRef } from "react";
import type { CollisionParams } from "@/hooks/battle/player/useMovement";

export const BATTLE_DEFAULT_STATE = {
  x: 100,
  y: 670,
  groundY: 670,
  velY: 0,
  state: "idle" as const,
  battleDirection: "right" as const,
};

export function createBattleCollisionRef() {
  return useRef<CollisionParams>({
    map: null,
    TILE_SIZE: 0,
    scaleX: 1,
    scaleY: 1,
  });
}
