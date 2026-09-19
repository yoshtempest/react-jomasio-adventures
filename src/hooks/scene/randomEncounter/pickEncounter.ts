import type { EncounterDef } from "@/utils/types/battle/randomEncounter";

export function pickEncounter(encounters: EncounterDef[]): string {
  const totalWeight = encounters.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const e of encounters) {
    roll -= e.weight;
    if (roll <= 0) return e.route;
  }
  return encounters[encounters.length - 1]!.route;
}
