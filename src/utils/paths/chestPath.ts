import { asset } from "./asset";

export function chestPath(name: string): string {
  return asset(`/assets/items/chests/${name}`);
}
