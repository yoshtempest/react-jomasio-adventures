import { asset } from "./asset";

export function rankBadgePath(name: string): string {
  return asset(`/assets/badges/ranks/${name}`);
}
