import { libraryMessages } from "@/data/dialogues/library/messages";
import { createInteractionMap, createPickupHandler } from "./builder";
import type { PickupDeps } from "@/utils/types/interaction";

export function createLibrary(deps: PickupDeps) {
  return createInteractionMap(libraryMessages, deps, {
    "12,9": createPickupHandler({
      item: { id: "package_01" },
      pickupMessage: "Uma embalagem com surpresinha",
      alreadyPickedMessage: "Nenhuma outra surpresinha por aqui.",
    }),
    "12,5": createPickupHandler({
      item: { id: "rare_chest" },
      pickupMessage: "Um baú! Que sorte",
      alreadyPickedMessage: "Nada por aqui.",
    }),
  });
}
