import { NPCS } from "@/data/npc";
import { getNpcStats } from "@/gameRules/npc/npcStats";
import { getNpcVsPlayerMultiplier } from "@/gameRules/battle/npcVsPlayerDamage";
import type { SummonedNpc } from "@/utils/types/npc/npc";
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

  // O conjure define o dano do summon, mas a criatura invocada tem tipagem
  // própria: `getNpcVsPlayerMultiplier` aplica o elemento do NPC contra o do
  // player — invocar não pode ser o jeito de burlar a tabela elemental.
  return Math.round(
    combatService.calculateNpcDamage(stats.damage, playerClass) *
      getNpcVsPlayerMultiplier(s.npcType, playerCharacter),
  );
}
