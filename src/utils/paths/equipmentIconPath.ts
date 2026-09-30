import { asset } from "./asset";

export function equipmentIconPath(name: string): string {
  return asset(`/assets/equipments/${name}`);
}
