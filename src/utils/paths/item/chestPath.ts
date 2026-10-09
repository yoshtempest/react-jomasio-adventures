import { asset } from "@/utils/paths/asset";

export function chestPath(name: string): string {
  return asset(`/assets/items/chests/${name}`);
}
