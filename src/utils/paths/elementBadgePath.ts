import { asset } from "./asset";

export function elementBadgePath(name: string): string {
  return asset(`/assets/badges/elements/${name}`);
}
