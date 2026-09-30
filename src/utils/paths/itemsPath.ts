import { asset } from "./asset";

export function itemsPath(path: string) {
  return asset(`/assets/items/${path}`);
}
