import { asset } from "@/utils/paths/asset";

export function platePath(name: string): string {
  return asset(`/assets/plates/${name}`);
}
