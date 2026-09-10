import type { ProfessionId } from "@/utils/types/player/profession";
import { WOOD_LEVELS } from "./woodLevels";
import { ORE_LEVELS } from "./oreLevels";
import { FISH_LEVELS } from "./fishLevels";
import { WEIGHT_LEVELS } from "./weightLevels";
import {
  PROFESSION_WEAPON_TIERS,
  PROFESSION_WEAPONS,
  getProfessionWeaponId,
} from "./weapons";

function levelsToIds<T extends { commonId: string; rareId: string }>(
  levels: readonly T[],
): string[] {
  const ids = new Set<string>();
  for (const entry of levels) {
    ids.add(entry.commonId);
    ids.add(entry.rareId);
  }
  return [...ids];
}

function weaponIdsFor(professionId: ProfessionId): string[] {
  const config = PROFESSION_WEAPONS[professionId];
  return PROFESSION_WEAPON_TIERS.map((t) =>
    getProfessionWeaponId(config, t.id),
  );
}

const RESOURCE_MAP: Partial<Record<ProfessionId, string[]>> = {
  lumberjack: levelsToIds(WOOD_LEVELS),
  miner: levelsToIds(ORE_LEVELS),
  fisher: levelsToIds(FISH_LEVELS),
  bodyBuilder: levelsToIds(WEIGHT_LEVELS),
};

const ALL_PROFESSIONS: ProfessionId[] = [
  "alchemist",
  "chef",
  "lumberjack",
  "farmer",
  "fisher",
  "pastryChef",
  "butcher",
  "bodyBuilder",
  "mechanic",
  "miner",
  "painter",
];

function buildProfessionItems(): Record<ProfessionId, ReadonlySet<string>> {
  const result = {} as Record<ProfessionId, ReadonlySet<string>>;

  for (const id of ALL_PROFESSIONS) {
    const config = PROFESSION_WEAPONS[id];
    const items = [
      ...(RESOURCE_MAP[id] ?? []),
      config.materialId,
      ...weaponIdsFor(id),
    ];
    result[id] = new Set(items);
  }

  return result;
}

export const PROFESSION_ITEMS = buildProfessionItems();
