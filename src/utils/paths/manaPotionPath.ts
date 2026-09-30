import { asset } from "./asset";

export function manaPotionPath(name: string): string {
  return asset(`/assets/items/manaPotion/${name}`);
}
