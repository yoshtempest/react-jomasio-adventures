import type {
  ProfessionProficiency,
  ProfessionId,
} from "@/utils/types/player/profession";
import type { MaterialId } from "@/data/items/crafting";
import { PROFESSIONS } from "@/data/professions";

export const PROFESSION_XP_PER_GATHER = 10;

export const DEFAULT_PROFESSION_PROFICIENCY: ProfessionProficiency = {
  level: 1,
  xp: 0,
};

/** XP necessário para sair do nível atual: cresce com o nível. */
export function getProfessionXPToNextLevel(level: number) {
  return level * 25;
}

export function isMaxProfessionLevel(_level: number) {
  return false;
}

/**
 * Aplica XP numa proficiência, subindo quantos níveis forem necessários.
 * Função pura — side effects (sons etc.) ficam por conta do chamador.
 */
export function applyProficiencyXP(
  current: ProfessionProficiency | undefined,
  amount: number,
): { proficiency: ProfessionProficiency; leveledUp: boolean; levelsGained: number } {
  let { level, xp } = current ?? DEFAULT_PROFESSION_PROFICIENCY;
  xp += amount;

  let levelsGained = 0;

  while (!isMaxProfessionLevel(level) && xp >= getProfessionXPToNextLevel(level)) {
    xp -= getProfessionXPToNextLevel(level);
    level++;
    levelsGained++;
  }

  return {
    proficiency: { level, xp },
    leveledUp: levelsGained > 0,
    levelsGained,
  };
}

/** Multiplicador de quantidade de drop: nv1 = 1x, +15% por nível. */
export function getGatherDropMultiplier(level: number) {
  return 1 + (level - 1) * 0.15;
}

/** Chance de coletar material raro: 5% no nv1, +1.5% por nível, teto de 50%. */
export function getRareDropChance(level: number) {
  return Math.min(0.05 + (level - 1) * 0.015);
}

export function getEpicDropChance(level: number) {
  return Math.min(0.01 + (level - 1) * 0.05);
}

export type GatherLootTier = "common" | "rare" | "epic";

export type GatherLootEntry = {
  itemId: MaterialId;
  baseQty: number;
  tier: GatherLootTier;
};

export type GatherRollResult = {
  items: { itemId: MaterialId; qty: number }[];
  totalQty: number;
};

/**
 * Rola o loot de um nó de coleta para uma proficiência:
 * - itens comuns sempre dropam, com quantidade escalada pelo nível;
 * - itens raros só dropam se passar na chance de raridade.
 */
export function rollGatherLoot(
  lootTable: GatherLootEntry[],
  level: number,
): GatherRollResult {
  const multiplier = getGatherDropMultiplier(level);
  const rareChance = getRareDropChance(level);
  const epicChance = getEpicDropChance(level);

  const items = lootTable
    .map((entry) => {
      if (entry.tier === "rare" && Math.random() >= rareChance) return null;
      if (entry.tier === "epic" && Math.random() >= epicChance) return null;
      const qty = Math.max(1, Math.round(entry.baseQty * multiplier));
      return { itemId: entry.itemId, qty };
    })
    .filter((entry): entry is { itemId: MaterialId; qty: number } => entry !== null);

  return {
    items,
    totalQty: items.reduce((sum, item) => sum + item.qty, 0),
  };
}

export function isProfessionId(value: string): value is ProfessionId {
  return PROFESSIONS.some((p) => p.id === value);
}
