import { cafeteriaMessages } from "@/data/dialogues/cafeteria/messages";
import { createInteractionMap, createPickupHandler } from "./builder";
import type {
  PickupDeps,
  InventoryDeps,
  QuestDeps,
} from "@/utils/types/interaction";

type CafeteriaDeps = PickupDeps & InventoryDeps & QuestDeps;

export function createCafeteria(deps: CafeteriaDeps) {
  return createInteractionMap(cafeteriaMessages, deps, {
    "11,10": createPickupHandler({
      item: { id: "sausage" },
      flagId: "picked_sausage",
      pickupMessage: "Você pegou no linguição.",
      alreadyPickedMessage: "Nada mais aqui.",
      questProgress: { id: "go_cafeteria", step: 1 },
    }),
  });
}
