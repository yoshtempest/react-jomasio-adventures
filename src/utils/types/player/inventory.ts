export type InventoryItem = {
  id: string;
  name: string;
  type?: "map" | "teleport" | "key" | "none";
};