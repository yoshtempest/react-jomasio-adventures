import { asset } from "@/utils/paths/asset";

export function manaPotionPath(name: string): string {
  return asset(`/assets/items/manaPotion/${name}`);
}
