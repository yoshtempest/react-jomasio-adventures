import type { InventoryItem } from "@/utils/types/player/inventory";

export type ContainerSlot = InventoryItem | null;

export type ContainerSlots = ContainerSlot[];

export type ContainerDef = {
  id: string;
  label: string;
  size: number;
  cols: number;
  defaultSlots: ContainerSlots;
  storageKey: string;
};
