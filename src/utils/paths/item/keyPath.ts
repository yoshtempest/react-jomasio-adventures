import { asset } from "@/utils/paths/asset";

export function keyPath(name: string): string {
  return asset(`/assets/items/keys/${name}`);
}
