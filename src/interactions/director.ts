import { directorMessages } from "@/data/maps/director/messages";
import { useQuestActions } from "@/hooks/useQuestActions";
import { createInteractionMap } from "./builder";
import type { KeyDeps, InventoryDeps } from "@/utils/types/interaction";

type DirectorDeps = KeyDeps & InventoryDeps;

export function createDirector(deps: DirectorDeps) {
  const { progressQuest } = useQuestActions();

  return createInteractionMap(directorMessages, deps, {
    "4,3": ({ hasItem, setPopup, removeItem, navigate }) => {
      if (hasItem("key_01")) {
        setPopup("Você usou a chave.");
        progressQuest("director_escape", 1);

        setTimeout(() => {
          removeItem("key_01");
          navigate?.("/cantina/two");
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