import { asset } from "./asset";

export function mapAssetPath(name: string): string {
  return asset(`/assets/map/${name}`);
}
