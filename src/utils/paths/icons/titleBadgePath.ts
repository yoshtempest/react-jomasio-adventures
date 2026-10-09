import { asset } from "@/utils/paths/asset";

export function titleBadgePath(name: string): string {
  return asset(`/assets/badges/titles/${name}`);
}
