import { FOODS } from "@/data/items/consumable/food";

export function getRandomFoodIds(count: number): string[] {
  const foodIds = Object.keys(FOODS);
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * foodIds.length);
    result.push(foodIds[randomIndex]!);
  }
  return result;
}