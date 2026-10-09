import { asset } from "@/utils/paths/asset";

export function playerPath(path: string) {
  return asset(`/assets/player/${path}`);
}
