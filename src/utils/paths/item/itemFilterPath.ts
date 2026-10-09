import { asset } from "@/utils/paths/asset";

export function itemFilterPath(name: string): string {
  return asset(`/assets/items/filter/${name}`);
}
