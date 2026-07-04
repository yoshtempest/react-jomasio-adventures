import { useRef } from "react";
import type { CollisionParams } from "@/utils/types/battle/collision";
import { BATTLE_SPAWN } from "@/gameRules/battle/spawnPoints";

export const BATTLE_DEFAULT_STATE = {
  x: BATTLE_SPAWN.player.x,
  y: BATTLE_SPAWN.player.y,
  groundY: BATTLE_SPAWN.player.y,
  velY: 0,
  state: "idle" as const,
  battleDirection: "right" as const,
  bleedUntil: 0,
  pullFromX: 0,
  pullToX: 0,
  pullStartTime: 0,
};

export function useBattleCollisionRef() {
  return useRef<CollisionParams>({
    map: null,
    TILE_SIZE: 0,
    scaleX: 1,
    scaleY: 1,
  });
}
