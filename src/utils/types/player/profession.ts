import type { MaterialId } from "@/data/items/crafting";
import type { Character } from "@/utils/types/player/player";

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

export type ProfessionProficiency = {
  level: number;
  xp: number;
};

export type CharacterProficiencies = Partial<
  Record<ProfessionId, ProfessionProficiency>
>;

export type CharactersProficiencies = Record<Character, CharacterProficiencies>;
