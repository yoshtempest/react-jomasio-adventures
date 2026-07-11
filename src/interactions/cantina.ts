import { cantinaMessages } from "@/data/dialogues/cantina/messages";
import { createInteractionMap, createPickupHandler } from "./builder";
import type { PickupDeps } from "@/utils/types/interaction";

export function createCantina(deps: PickupDeps) {
  return createInteractionMap(cantinaMessages, deps, {
    "13,4": createPickupHandler({
      item: { id: "orange_juice" },
      flagId: "picked_orange_juice",
      pickupMessage: "Que delícia! um suco de laranja",
      alreadyPickedMessage: "Nenhuma outra delícia por aqui.",
    }),
  });
}
