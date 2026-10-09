import { asset } from "@/utils/paths/asset";

export function statusIconPath(name: string): string {
  return asset(`/assets/status/${name}`);
}
