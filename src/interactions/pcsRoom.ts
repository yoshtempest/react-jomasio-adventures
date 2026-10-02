import { pcsRoomMessages } from "@/data/dialogues/pcsRoom/messages";
import {
  createInteractionMap,
  createPickupHandler,
  createMessageCardHandler,
createImageHandler
} from "./builder";
import type { PickupDeps, MessageDeps, ImageDeps } from "@/utils/types/interaction";
import { historyPath } from "@/utils/paths/historyPath";

export function createPcsRoom(deps: PickupDeps & MessageDeps & ImageDeps) {
  return createInteractionMap(pcsRoomMessages, deps, {
    "16,2": createMessageCardHandler({
      title: "Diário de Reincardion",
      subtitle: "Cap 3",
      description:
        "Aprendi a usar a internet, mas aqui não tem internet, triste, não?",
    }),
    "13,2": createImageHandler({
      src: historyPath("healthlyTips.svg"),
      message:
        "Dicas para manter-se saudável...",
    }),

    "15,2": createImageHandler({
      src: historyPath("damnReincarnation.svg"),
      message:
        "Damn Reincarnation cap novo? MENTIRA!",
    }),


    "10.6, 6.5": createPickupHandler({
      item: { id: "desired_gear" },
      flagId: "picked_desired_gear",
      pickupMessage: "Uma engrenagem, Era essa a peça que eu queria!",
      alreadyPickedMessage: "Nenhuma outra peça por aqui.",
    }),
  });
}
