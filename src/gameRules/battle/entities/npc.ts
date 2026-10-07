import { getNpcStats } from "@/gameRules/npc/npcStats";

type NPCClass = Parameters<typeof getNpcStats>[1];

export function getNpcMaxHp(
  level: number,
  npcClass: NPCClass,
  difficulty: NpcDifficulty,
  npcType?: string,
) {
  return getNpcStats(level, npcClass, difficulty, 1, npcType).hp;
}
