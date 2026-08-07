import { directorMessages } from "@/data/dialogues/director/messages";
import { createInteractionMap, createPickupHandler } from "./builder";
import type {
  PickupDeps,
  InventoryDeps,
  QuestDeps,
} from "@/utils/types/interaction";

type DirectorDeps = PickupDeps &
  InventoryDeps &
  QuestDeps & {
    playSFX?: (src: string, volume?: number) => void;
  };

export function createDirector(deps: DirectorDeps) {
  const { progressQuest } = deps;

  return createInteractionMap(directorMessages, deps, {
    "4,2": ({ hasItem, setPopup, navigate, playSFX }) => {
      if (hasItem("director_key")) {
        setPopup("Você usou a chave.");
        progressQuest("director_escape", 1);
        playSFX?.("/assets/songs/transitions/doorOpen.mp3", 0.6);

        setTimeout(() => {
          playSFX?.("/assets/songs/transitions/undertaleToBattle.mp3", 0.6);
          navigate?.("/cantina/one");
        }, 1000);
      } else {
        setPopup("Essa porta está trancada.");
      }
    },

    "18.4, 5": createPickupHandler({
      item: { id: "director_key" },
      flagId: "picked_director_key",
      pickupMessage: "Uma chave suspeita, deve ser da porta...",
    }),
  });
}
