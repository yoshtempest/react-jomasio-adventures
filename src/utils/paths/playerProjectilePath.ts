import { asset } from "./asset";

export function playerProjectilePath(path: string) {
  return asset(`/assets/player/projectiles/${path}`);
}
