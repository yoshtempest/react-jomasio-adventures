import { cantinaMessages } from "@/data/dialogues/cantina/messages";
import { createInteractionMap, createPickupHandler } from "./builder";
import type { PickupDeps } from "@/utils/types/interaction";

export function createBrodiClass(deps: PickupDeps) {
  return createInteractionMap(cantinaMessages, deps, {
    "13,4": createPickupHandler({
      item: { id: "goat_meat" },
      pickupMessage: "Por que tem carne de bode dentro de um baú?",
      alreadyPickedMessage: "Tá passando a mão na mesa por quê? Não tá vendo que não tem nada aí?",
    }),
  });
}
