import { getNpcStats } from "@/utils/types/npc/npcProgress";
import type { NpcDifficulty } from "@/utils/types/npc/npcProgress";

type NPCClass = Parameters<typeof getNpcStats>[1];

export function getNpcMaxHp(
  level: number,
  npcClass: NPCClass,
  difficulty: NpcDifficulty,
) {
  return getNpcStats(level, npcClass, difficulty).hp;
}
