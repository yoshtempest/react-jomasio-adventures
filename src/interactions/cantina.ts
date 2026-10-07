import { cantinaMessages } from "@/data/dialogues/cantina/messages";
import {
  createInteractionMap,
  createPickupHandler,
  createMessageCardHandler,
} from "./builder";
import type { PickupDeps, MessageDeps } from "@/utils/types/interaction";

export function createCantina(deps: PickupDeps & MessageDeps) {
  return createInteractionMap(cantinaMessages, deps, {
    "8,4": createMessageCardHandler({
      title: "Carta de Tutorial",
      subtitle: "Reincardion",
      description:
        "Olá jogador, sou Reincardion e gostaria de lhe mostrar um tutorial sobre como jogar.",
    }),
    "9,4": createMessageCardHandler({
      title: "Carta de Tutorial",
      subtitle: "Continuação",
      description:
        "Entretanto essa carta não tem muito espaço... então fica pra próxima, beleza?",
    }),

    "16.8, 3.5": createPickupHandler({
      item: { id: "orange_juice" },
      flagId: "picked_orange_juice",
      pickupMessage: "Que delícia! um suco de laranja",
      alreadyPickedMessage: "Nenhuma outra delícia por aqui.",
    }),
  });
}
