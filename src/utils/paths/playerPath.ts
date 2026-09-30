import { asset } from "./asset";

export function playerPath(path: string) {
  return asset(`/assets/player/${path}`);
}
