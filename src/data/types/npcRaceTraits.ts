import { NPC_RACES } from "@/data/types/npcElementTypes";
import { RACE_TRAITS } from "@/data/characters/races/traits/constants";
import { summarizeRaceTraits } from "@/data/characters/races/traits/summary";
import type {
  RaceTrait,
  RaceTraitSummary,
} from "@/utils/types/character/raceTrait";

const npcCache = new Map<string, RaceTraitSummary>();

/**
 * Traits raciais de um NPC, pelas mesmas raças declaradas em `NPC_RACES` — o
 * goblin igniano queima o jogador e o golem terrano empurra com a mesma regra
 * que os personagens recebem. NPC sem raça declarada devolve o resumo neutro
 * (multiplicadores 1, nada imune) em vez de estourar: `NPC_RACES` é uma
 * Partial na prática e LPCs podem ficar de fora.
 *
 * Importa `NPC_RACES` direto (e não o barrel de traits) para não fechar ciclo
 * com `npcElementTypes`.
 */
export function getNpcTraitSummary(npcType: string): RaceTraitSummary {
  const cached = npcCache.get(npcType);
  if (cached) return cached;

  const race = NPC_RACES[npcType as keyof typeof NPC_RACES];
  const summary = race
    ? summarizeRaceTraits(
        race.races.flatMap((r) => RACE_TRAITS[r] as readonly RaceTrait[]),
      )
    : summarizeRaceTraits([]);

  npcCache.set(npcType, summary);
  return summary;
}
