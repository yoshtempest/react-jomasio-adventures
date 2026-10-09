import { asset } from "@/utils/paths/asset";

export function lootBagPath(name: string): string {
  return asset(`/assets/items/lootBag/${name}`);
}
