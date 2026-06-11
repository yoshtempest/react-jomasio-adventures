export type InventoryItem = {
  id: ItemId;
  name: string;
  image?: string;
  type?: "map" | "teleport" | "key" | "material" | "none";
  qty?: number;
};