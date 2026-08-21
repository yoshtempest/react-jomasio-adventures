import { cafeteriaMessages } from "@/data/dialogues/cafeteria/messages";
import { createContainerHandler, createInteractionMap } from "./builder";
import type {
  ContainerDeps,
  InventoryDeps,
  QuestDeps,
} from "@/utils/types/interaction";

type CafeteriaDeps = ContainerDeps & InventoryDeps & QuestDeps;

export function createCafeteria(deps: CafeteriaDeps) {
  return createInteractionMap(cafeteriaMessages, deps, {
    "15,4": createContainerHandler(),
  });
}
