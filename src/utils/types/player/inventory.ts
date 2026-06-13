export type InventoryItem = {
  id: ItemId;
  name: string;
  image?: string;
  description?: string;
  type?: "map" | "teleport" | "key" | "material" | "none";
  qty?: number;
};