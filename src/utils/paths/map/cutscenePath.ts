import { asset } from "@/utils/paths/asset";

export function cutscenePath(name: string): string {
  return asset(`/assets/history/cutscenes/${name}`);
}
