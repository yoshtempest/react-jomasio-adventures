import { asset } from "./asset";

export function questIconPath(name: string): string {
  return asset(`/assets/quests/${name}`);
}
