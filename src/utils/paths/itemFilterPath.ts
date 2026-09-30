import { asset } from "./asset";

export function itemFilterPath(name: string): string {
  return asset(`/assets/items/filter/${name}`);
}
