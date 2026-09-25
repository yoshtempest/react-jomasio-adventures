import { NPCS } from "@/data/npc";
import { getNpcStats } from "@/gameRules/npc/npcStats";
import type { SummonedNpc } from "@/utils/types/npc/npc";
import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";
import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import { combatService } from "@/services/combat";


export function computeSummonDamage(
  s: SummonedNpc,
  npcLevel: number,
  difficulty: NpcDifficulty,
  playerClass: PlayerClass,
  playerCharacter: CharacterId,
): number | null {
  const data = NPCS[s.npcType];
  if (!data) return null;

  const stats = getNpcStats(
    s.level ?? npcLevel,
    data.class,
    difficulty,
    s.statMultiplier ?? 1,
  );

  const elementMultiplier = combatService.getElementMultiplier(
    getNpcElementTypes(s.npcType),
    CHARACTER_ELEMENT_TYPES[playerCharacter],
  );

  return Math.round(
    combatService.calculateNpcDamage(stats.damage, playerClass) *
      elementMultiplier,
  );
}