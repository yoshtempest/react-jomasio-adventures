import { asset } from "@/utils/paths/asset";

export function questIconPath(name: string): string {
  return asset(`/assets/quests/${name}`);
}
