import { cafeteriaMessages } from "@/data/maps/cafeteria/messages";
import { useQuestActions } from "@/hooks/useQuestActions";
import { createInteractionMap } from "./builder";
import type { KeyDeps, InventoryDeps } from "@/utils/types/interaction";

type CafeteriaDeps = KeyDeps & InventoryDeps;

export function createCafeteria(deps: CafeteriaDeps) {
  const { progressQuest } = useQuestActions();

  return createInteractionMap(cafeteriaMessages, deps, {
    "11,10": ({ addItem, setPopup, gotKey, setGotKey }) => {
      if (!gotKey) {
        setPopup("Você pegou no linguição.");
        progressQuest("go_cafeteria", 1);

        addItem({
          id: "key_01",
          name: "Linguição",
        });

        setGotKey?.(true);
      } else {
        setPopup("Nada mais aqui.");
      }
    },
  });
}