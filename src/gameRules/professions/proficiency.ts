import type {
  ProfessionProficiency,
  ProfessionId,
} from "@/utils/types/player/profession";
import type { MaterialId } from "@/data/items/crafting";
import { PROFESSIONS } from "@/data/professions";

export const PROFESSION_XP_PER_GATHER = 10;

/**
 * Multiplicador de XP quando a forma rara de um item da profissão dropa
 * durante a coleta: 10x o XP que a forma normal daria no mesmo interact.
 */
export const GATHER_RARE_XP_MULTIPLIER = 10;

/**
 * Nível máximo que uma profissão pode alcançar.
 */
export const MAX_PROFESSION_LEVEL = 200;

export const DEFAULT_PROFESSION_PROFICIENCY: ProfessionProficiency = {
  level: 1,
  xp: 0,
};

/** XP necessário para sair do nível atual: cresce com o nível. */
export function getProfessionXPToNextLevel(level: number) {
  return level * 25;
}

export function isMaxProfessionLevel(level: number): boolean {
  return level >= MAX_PROFESSION_LEVEL;
}

/**
 * Aplica XP numa proficiência, subindo quantos níveis forem necessários.
 * Função pura — side effects (sons etc.) ficam por conta do chamador.
 */
export function applyProficiencyXP(
  current: ProfessionProficiency | undefined,
  amount: number,
): {
  proficiency: ProfessionProficiency;
  leveledUp: boolean;
  levelsGained: number;
} {
  let { level, xp } = current ?? DEFAULT_PROFESSION_PROFICIENCY;
  xp += amount;

  let levelsGained = 0;

  while (
    !isMaxProfessionLevel(level) &&
    xp >= getProfessionXPToNextLevel(level)
  ) {
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

/**
 * Multiplicador de XP ao interagir com um item da profissão, baseado na
 * diferença entre o nível do jogador e o nível do item.
 *
 * - nível do jogador < nível do item: não é possível interagir (bloqueado);
 * - mesma nível: 100% do XP da base;
 * - jogador mais alto que o item: -9% de XP por nível de diferença,
 *   com um piso de 10% (nunca menos que 0.1x da base).
 *
 * Ex.: Lenhador nv.20 cortando uma madeira de nível 10 recebe 0.1x do XP
 * que ela provê (10xp de base -> 1xp).
 */
export function getGatherXpMultiplier(
  playerLevel: number,
  itemLevel: number,
): number {
  if (playerLevel < itemLevel) return 0;
  const penalty = (playerLevel - itemLevel) * 0.09;
  return Math.max(0.1, 1 - penalty);
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
    .filter(
      (entry): entry is { itemId: MaterialId; qty: number } => entry !== null,
    );

  return {
    items,
    totalQty: items.reduce((sum, item) => sum + item.qty, 0),
  };
}

export function isProfessionId(value: string): value is ProfessionId {
  return PROFESSIONS.some((p) => p.id === value);
}
