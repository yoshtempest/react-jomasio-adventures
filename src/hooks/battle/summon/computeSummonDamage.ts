import { NPCS } from "@/data/npc";
import { getNpcStats } from "@/gameRules/npc/npcStats";
import { getNpcVsPlayerMultiplier } from "@/gameRules/battle/raceDamage";
import type { SummonedNpc } from "@/utils/types/npc/npc";
import { combatService } from "@/services/combat";

export function computeSummonDamage(
  s: SummonedNpc,
  npcLevel: number,
  difficulty: NpcDifficulty,
  playerClass: PlayerClass,
  playerCharacter: CharacterId,
  playerLevel: number = 0,
): number | null {
  const data = NPCS[s.npcType];
  if (!data) return null;

  const stats = getNpcStats(
    s.level ?? npcLevel,
    data.class,
    difficulty,
    s.statMultiplier ?? 1,
  );

  // O conjure define o dano do summon, mas a criaturasummonada ainda tem race:
  // `getNpcVsPlayerMultiplier` aplica elemento, trait do NPC e resistência do
  // player — resistida racial não pode ser burcada por invocar.
  return Math.round(
    combatService.calculateNpcDamage(stats.damage, playerClass) *
      getNpcVsPlayerMultiplier(s.npcType, playerCharacter, playerLevel),
  );
}
