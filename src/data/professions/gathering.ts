import type { ProfessionId } from "@/utils/types/player/profession";
import type { GatherLootEntry } from "@/gameRules/professions/proficiency";

/**
 * O que cada profissão pode coletar do mapa.
 * Itens "rare" só dropam se passarem na chance de raridade da proficiência
 * (getRareDropChance); itens "common" sempre dropam, com quantidade
 * escalada pelo nível (getGatherDropMultiplier).
 */
export const GATHER_LOOT_TABLES: Record<ProfessionId, GatherLootEntry[]> = {
  miner: [
    { itemId: "hungry_essence", baseQty: 2, tier: "common" },
    { itemId: "goat_horn", baseQty: 1, tier: "rare" },
    { itemId: "rare_scale", baseQty: 1, tier: "rare" },
  ],
  alchemist: [],
  farmer: [],
  fisher: [],
  pastryChef: [],
  butcher: [],
  bodyBuilder: [],
  mechanic: [],
  painter: [],
};
