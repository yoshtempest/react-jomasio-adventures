import type { NPCClass } from "@/utils/types/npc/npcProgress";

export function calculateXP(level: number, npcClass: NPCClass) {
  switch (npcClass) {
    case "common":
      return level;
    case "rare":
      return level * 2;
    case "boss":
      return level * 5;
  }
}