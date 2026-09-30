import { colKey } from "@/data/equipment/storage";

export function addToCollection(
  collection: Record<string, number>,
  id: EquipmentId,
  enhance: number,
): void {
  const key = colKey(id, enhance);
  collection[key] = (collection[key] ?? 0) + 1;
}
