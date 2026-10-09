import { asset } from "@/utils/paths/asset";

export function rankBadgePath(name: string): string {
  return asset(`/assets/badges/ranks/${name}`);
}
