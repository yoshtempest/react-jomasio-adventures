import { asset } from "@/utils/paths/asset";

export function itemPath(name: string): string {
  return asset(`/assets/items/${name}`);
}
