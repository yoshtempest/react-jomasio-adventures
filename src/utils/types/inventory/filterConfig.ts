import type { InventoryItem } from "@/utils/types/player/inventory";

export type FilterConfig = {
  labels: { type: string; label: string }[];
  active: string;
  onChange: (type: string) => void;
  filteredItems: InventoryItem[];
};