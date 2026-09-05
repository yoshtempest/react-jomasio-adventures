import { GAME_VIEWPORT_WIDTH_RATIO } from "@/data/grid";
import { ProjectileConstants } from "@/data/projectile";

const MAP_COLS = 17;
const MAP_ROWS = 13;
const SCALE_FIX = 1.4;

export function getReplayLayout(w: number, h: number) {
  const cw = w * GAME_VIEWPORT_WIDTH_RATIO;
  const ch = h;

  const TILE = Math.min(cw / MAP_COLS, ch / MAP_ROWS) * SCALE_FIX;

  const PLAYER = TILE * 1.4;

  const sx = w / ProjectileConstants.MAP_WIDTH;
  const sy = h / ProjectileConstants.MAP_HEIGHT;

  return {
    TILE,
    PLAYER,
    sx,
    sy,
  };
}
