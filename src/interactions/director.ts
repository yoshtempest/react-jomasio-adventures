import { directorMessages } from "@/data/maps/director/messages";
import { createInteractionMap } from "./builder";
import type { KeyDeps, InventoryDeps, QuestDeps } from "@/utils/types/interaction";

type DirectorDeps = KeyDeps & InventoryDeps & QuestDeps & {
  playSFX?: (src: string, volume?: number) => void;
};

export function createDirector(deps: DirectorDeps) {
  const { progressQuest } = deps;

  return createInteractionMap(directorMessages, deps, {
    "4,3": ({ hasItem, setPopup, removeItem, navigate, playSFX }) => {
      if (hasItem("key_01")) {
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

    "15,7": ({ addItem, setPopup, gotKey, setGotKey }) => {
      if (!gotKey) {
        setPopup("Uma chave suspeita, deve ser da porta...");

        addItem({
          id: "key_01",
          name: "Chave enferrujada",
        });

        setGotKey?.(true);
      } else {
        setPopup("Nada mais aqui.");
      }
    },
  });
}
