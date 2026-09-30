import { asset } from "./asset";

export function itemPath(name: string): string {
  return asset(`/assets/items/${name}`);
}
