import type { ContainerDef } from "@/utils/types/container";

export const CONTAINER_STORAGE_PREFIX = "container_";

export function containerStorageKey(id: string) {
  return `${CONTAINER_STORAGE_PREFIX}${id}`;
}

export const CAFETERIA_FRIDGE: ContainerDef = {
  id: "cafeteria_fridge",
  label: "Geladeira",
  size: 10,
  cols: 3,
  defaultSlots: [
    { id: "sausage" },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  storageKey: containerStorageKey("cafeteria_fridge"),
};
