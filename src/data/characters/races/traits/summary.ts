import { CHARACTER_RACES } from "@/data/characters/races/character";
import { RACE_TRAITS } from "@/data/characters/races/traits/constants";
import type { Race } from "@/utils/types/character/race";
import type {
  RaceStatBonus,
  RaceTrait,
  RaceTraitSummary,
} from "@/utils/types/character/raceTrait";
import type { PlayerStatus } from "@/utils/types/battle/status";

/** Soma campo a campo, ignorando bônus ausentes (`noUncheckedIndexedAccess`). */
function addStats(target: RaceStatBonus, bonus: RaceStatBonus): void {
  for (const key of Object.keys(bonus) as Array<keyof RaceStatBonus>) {
    const value = bonus[key];
    if (value === undefined) continue;
    target[key] = (target[key] ?? 0) + value;
  }
}

/**
 * Funde as traits de um conjunto de raças em um resumo único.
 *
 * Multiplicadores multiplicam (raças se somam, não se anulam); chance de
 * sangrar e empurrão ficam com o maior valor — duas traits iguais não podem
 * transformar 30% em 60% só por estarem no mesmo mestiço.
 */
export function summarizeRaceTraits(
  traits: readonly RaceTrait[],
): RaceTraitSummary {
  const immunities = new Set<PlayerStatus>();
  const stats: RaceStatBonus = {};

  let damageDealtMultiplier = 1;
  let damageTakenMultiplier = 1;
  let bleedOnHitChance = 0;
  let pushOnHitDistance = 0;

  for (const trait of traits) {
    switch (trait.kind) {
      case "statBonus":
        addStats(stats, trait.stats);
        break;
      case "damageDealt":
        damageDealtMultiplier *= trait.multiplier;
        break;
      case "damageTaken":
        damageTakenMultiplier *= trait.multiplier;
        break;
      case "statusImmunity":
        for (const status of trait.statuses) immunities.add(status);
        break;
      case "bleedOnHit":
        bleedOnHitChance = Math.max(bleedOnHitChance, trait.chance);
        break;
      case "pushOnHit":
        pushOnHitDistance = Math.max(pushOnHitDistance, trait.distance);
        break;
    }
  }

  return {
    stats,
    damageDealtMultiplier,
    damageTakenMultiplier,
    immuneStatuses: [...immunities],
    bleedOnHitChance,
    pushOnHitDistance,
  };
}

const raceCache = new Map<Race, RaceTraitSummary>();

/** Traits de uma raça, já fundidas (memoizado: roda dentro de state updater). */
export function getRaceTraitSummary(race: Race): RaceTraitSummary {
  const cached = raceCache.get(race);
  if (cached) return cached;

  const summary = summarizeRaceTraits(RACE_TRAITS[race]);
  raceCache.set(race, summary);
  return summary;
}

/**
 * Resumo de traits de um grupo de raças. Human aparece em todo personagem, então
 * o caso de uma raça só (NPCs de raça única) é o mais comum.
 */
export function getRacesTraitSummary(races: readonly Race[]): RaceTraitSummary {
  if (races.length === 1) return getRaceTraitSummary(races[0]!);
  return summarizeRaceTraits(
    races.flatMap((race) => RACE_TRAITS[race] as readonly RaceTrait[]),
  );
}

const characterCache = new Map<CharacterId, RaceTraitSummary>();

/** Traits raciais de um personagem jogável (todas as suas raças fundidas). */
export function getCharacterTraitSummary(
  character: CharacterId,
): RaceTraitSummary {
  const cached = characterCache.get(character);
  if (cached) return cached;

  const summary = getRacesTraitSummary(CHARACTER_RACES[character].races);
  characterCache.set(character, summary);
  return summary;
}
