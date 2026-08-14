import type { ProfessionInfo } from "@/utils/types/player/profession";

export const PROFESSIONS: ProfessionInfo[] = [
  {
    id: "alquimista",
    name: "Alquimista",
    npcName: "Val Val",
    toolId: "weapon_frasco_alquimico",
    toolName: "Frasco Alquímico",
    recipe: { hungry_essence: 3, rare_scale: 2 },
  },
  {
    id: "agricultor",
    name: "Agricultor",
    npcName: "Cendeiro",
    toolId: "weapon_enxada",
    toolName: "Enxada",
    recipe: { hungry_essence: 5 },
  },
  {
    id: "pescador",
    name: "Pescador",
    npcName: "???",
    toolId: "weapon_vara_pesca",
    toolName: "Vara de Pesca",
    recipe: { hungry_essence: 4, rare_scale: 2 },
  },
  {
    id: "confeiteiro",
    name: "Confeiteiro",
    npcName: "Jucimaria",
    toolId: "weapon_rolo_massa",
    toolName: "Rolo de Massa",
    recipe: { hungry_essence: 4 },
  },
  {
    id: "acougueiro",
    name: "Açougueiro",
    npcName: "Tim",
    toolId: "weapon_cutelo",
    toolName: "Cutelo",
    recipe: { goat_horn: 3, hungry_essence: 2 },
  },
  {
    id: "bodyBuilder",
    name: "BodyBuilder",
    npcName: "Franciane",
    toolId: "weapon_halter",
    toolName: "Halter",
    recipe: { goat_horn: 4 },
  },
  {
    id: "mecanico",
    name: "Mecânico",
    npcName: "Binha",
    toolId: "weapon_chave_inglesa",
    toolName: "Chave Inglesa",
    recipe: { goat_horn: 2, figurant_totem: 2 },
  },
  {
    id: "mineiro",
    name: "Mineiro",
    npcName: "???",
    toolId: "weapon_picareta",
    toolName: "Picareta",
    recipe: { hungry_essence: 5, goat_horn: 2 },
  },
  {
    id: "pintor",
    name: "Pintor",
    npcName: "???",
    toolId: "weapon_pincel",
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
