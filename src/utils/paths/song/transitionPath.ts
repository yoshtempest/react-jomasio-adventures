import { asset } from "@/utils/paths/asset";

export function transitionPath(name: string): string {
  return asset(`/assets/songs/transitions/${name}`);
}
