import { libraryMessages } from "@/data/maps/library/messages";
import { createInteractionMap, createPickupHandler } from "./builder";
import type { PickupDeps } from "@/utils/types/interaction";

export function createLibrary(deps: PickupDeps) {
  return createInteractionMap(libraryMessages, deps, {
    "12,9": createPickupHandler({
      item: { id: "package_01" },
      pickupMessage: "Uma embalagem com surpresinha",
      alreadyPickedMessage: "Nenhuma outra surpresinha por aqui.",
    }),
  });
}
