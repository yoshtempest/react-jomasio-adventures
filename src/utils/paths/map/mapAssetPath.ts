import { asset } from "@/utils/paths/asset";

export function mapAssetPath(name: string): string {
  return asset(`/assets/map/${name}`);
}
