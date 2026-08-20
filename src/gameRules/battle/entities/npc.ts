import { getNpcStats } from "@/gameRules/npc/npcStats";

type NPCClass = Parameters<typeof getNpcStats>[1];

export function getNpcMaxHp(
  level: number,
  npcClass: NPCClass,
  difficulty: NpcDifficulty,
) {
  return getNpcStats(level, npcClass, difficulty).hp;
}
