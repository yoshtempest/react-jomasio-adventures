import { pcsRoomMessages } from "@/data/dialogues/pcsRoom/messages";
import { createInteractionMap, createPickupHandler, createMessageCardHandler } from "./builder";
import type { PickupDeps, MessageDeps } from "@/utils/types/interaction";

export function createPcsRoom(deps: PickupDeps & MessageDeps) {
  return createInteractionMap(pcsRoomMessages, deps, {
    "16,2": createMessageCardHandler({
      title: "Diário de Reincardion",
      subtitle: "Cap 3",
      description:
        "Aprendi a usar a internet, mas aqui não tem internet, triste, não?",
    }),

        "10.6, 6.5": createPickupHandler({
      item: { id: "desired_gear" },
      flagId: "picked_desired_gear",
      pickupMessage: "Uma engrenagem, Era essa a peça que eu queria!",
      alreadyPickedMessage: "Nenhuma outra peça por aqui.",
    }),
  });
}
