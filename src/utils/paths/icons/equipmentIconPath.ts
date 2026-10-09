import { asset } from "@/utils/paths/asset";

export function equipmentIconPath(name: string): string {
  return asset(`/assets/equipments/${name}`);
}
