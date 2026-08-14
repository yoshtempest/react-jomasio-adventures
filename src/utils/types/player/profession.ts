import type { MaterialId } from "@/data/items/crafting";

export type ProfessionId =
  | "alquimista"
  | "agricultor"
  | "pescador"
  | "confeiteiro"
  | "acougueiro"
  | "bodyBuilder"
  | "mecanico"
  | "mineiro"
  | "pintor";

export type CraftRecipe = Partial<Record<MaterialId, number>>;

export type ProfessionInfo = {
  id: ProfessionId;
  name: string;
  npcName: string;
  toolId: EquipmentId;
  toolName: string;
  recipe: CraftRecipe;
};
