import { pcsRoomMessages } from "@/data/dialogues/pcsRoom/messages";
import { createInteractionMap, createPickupHandler } from "./builder";
import type { PickupDeps } from "@/utils/types/interaction";

export function createPcsRoom(deps: PickupDeps) {
  return createInteractionMap(pcsRoomMessages, deps, {
    "10.6, 6.5": createPickupHandler({
      item: { id: "desired_gear" },
      flagId: "picked_desired_gear",
      pickupMessage: "Uma engrenagem, Era essa a peça que eu queria!",
      alreadyPickedMessage: "Nenhuma outra peça por aqui.",
    }),
  });
}
