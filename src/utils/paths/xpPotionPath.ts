import { asset } from "./asset";

export function xpPotionPath(name: string): string {
  return asset(`/assets/items/xpPotion/${name}`);
}
