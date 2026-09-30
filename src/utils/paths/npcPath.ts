import { NPC_CATEGORY } from "@/data/sprites/sprites";
import { asset } from "./asset";

export function npcPath(path: string) {
  const cleanPath = path.replace(/^\/+/, "");
  const npcType = cleanPath.split("/")[0]!;
  const category = NPC_CATEGORY[npcType];
  if (category) {
    return asset(`/assets/npcs/${category}/${cleanPath}`);
  }
  return asset(`/assets/npcs/${cleanPath}`);
}
