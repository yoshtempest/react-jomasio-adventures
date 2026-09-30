import { asset } from "./asset";

export function coinPath(name: string): string {
  return asset(`/assets/items/coins/${name}`);
}
