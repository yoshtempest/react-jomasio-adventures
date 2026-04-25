import { getNpcStats } from "@/utils/types/npc/npcProgress";

type NPCClass = Parameters<typeof getNpcStats>[1];

export function getNpcMaxHp(level: number, npcClass: NPCClass) {
  return getNpcStats(level, npcClass).hp;
}