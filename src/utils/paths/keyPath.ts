import { asset } from "./asset";

export function keyPath(name: string): string {
  return asset(`/assets/items/keys/${name}`);
}
