import type { CraftRecipe } from "@/utils/types/player/profession";

export function getMaterialCount(
  items: { id: string; qty?: number }[],
  id: string,
): number {
  return items.find((i) => i.id === id)?.qty ?? 0;
}

export function canCraft(
  recipe: CraftRecipe,
  count: (id: string) => number,
): boolean {
  return Object.entries(recipe).every(([id, qty]) => count(id) >= (qty ?? 1));
}

export type MissingMaterial = {
  id: string;
  required: number;
  owned: number;
};

export function getMissingMaterials(
  recipe: CraftRecipe,
  count: (id: string) => number,
): MissingMaterial[] {
  return Object.entries(recipe)
    .filter(([id, qty]) => count(id) < (qty ?? 1))
    .map(([id, qty]) => ({
      id,
      required: qty ?? 1,
      owned: count(id),
    }));
}

export function recipeTotal(recipe: CraftRecipe): number {
  return Object.values(recipe).reduce<number>(
    (sum, qty) => sum + (qty ?? 1),
    0,
  );
}
