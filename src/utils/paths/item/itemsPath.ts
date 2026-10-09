import { asset } from "@/utils/paths/asset";

export function itemsPath(path: string) {
  return asset(`/assets/items/${path}`);
}
