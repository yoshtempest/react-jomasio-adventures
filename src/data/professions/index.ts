import type { ProfessionInfo } from "@/utils/types/player/profession";

export const PROFESSIONS: ProfessionInfo[] = [
  {
    id: "alchemist",
    name: "Alquimista",
    npcName: "Val Val",
    toolId: "weapon_cauldron",
    toolName: "Caldeirão",
    recipe: { hungry_essence: 3, rare_scale: 2 },
  },
  {
    id: "chef",
    name: "Cozinheiro",
    npcName: "???",
    toolId: "weapon_pan",
    toolName: "Rolo de Massa",
    recipe: { hungry_essence: 4 },
  },
  {
    id: "lumberjack",
    name: "Lenhador",
    npcName: "???",
    toolId: "weapon_axe",
    toolName: "Rolo de Massa",
    recipe: { hungry_essence: 4 },
  },
  {
    id: "farmer",
    name: "Agricultor",
    npcName: "Cendeiro",
    toolId: "weapon_hoe",
    toolName: "Enxada",
    recipe: { hungry_essence: 5 },
  },
  {
    id: "fisher",
    name: "Pescador",
    npcName: "???",
    toolId: "weapon_fishing_rod",
    toolName: "Vara de Pesca",
    recipe: { hungry_essence: 4, rare_scale: 2 },
  },
  {
    id: "pastryChef",
    name: "Confeiteiro",
    npcName: "Jucimaria",
    toolId: "weapon_rolling_pin",
    toolName: "Rolo de Massa",
    recipe: { hungry_essence: 4 },
  },
  {
    id: "butcher",
    name: "Açougueiro",
    npcName: "Tim",
    toolId: "weapon_cleaver",
    toolName: "Cutelo",
    recipe: { goat_horn: 3, hungry_essence: 2 },
  },
  {
    id: "bodyBuilder",
    name: "BodyBuilder",
    npcName: "Franciane",
    toolId: "weapon_dumbbell",
    toolName: "Halter",
    recipe: { goat_horn: 4 },
  },
  {
    id: "mechanic",
    name: "Mecânico",
    npcName: "Binha",
    toolId: "weapon_adjustable_wrench",
    toolName: "Chave Inglesa",
    recipe: { goat_horn: 2, figurant_totem: 2 },
  },
  {
    id: "miner",
    name: "Mineiro",
    npcName: "???",
    toolId: "weapon_pickaxe",
    toolName: "Picareta",
    recipe: { hungry_essence: 5, goat_horn: 2 },
  },
  {
    id: "painter",
    name: "Pintor",
    npcName: "???",
    toolId: "weapon_paint",
    toolName: "Pincel",
    recipe: { hungry_essence: 3, figurant_totem: 2 },
  },
];

export function getProfessionByToolId(
  toolId: EquipmentId,
): ProfessionInfo | undefined {
  return PROFESSIONS.find((p) => p.toolId === toolId);
}

export function isProfessionTool(toolId: EquipmentId): boolean {
  return PROFESSIONS.some((p) => p.toolId === toolId);
}
