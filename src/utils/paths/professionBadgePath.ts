import { asset } from "./asset";

export function professionBadgePath(name: string): string {
  return asset(`/assets/badges/professions/${name}`);
}
