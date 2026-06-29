import { cafeteriaMessages } from "@/data/maps/cafeteria/messages";
import { createInteractionMap } from "./builder";
import type {
  KeyDeps,
  InventoryDeps,
  QuestDeps,
} from "@/utils/types/interaction";

type CafeteriaDeps = KeyDeps & InventoryDeps & QuestDeps;

export function createCafeteria(deps: CafeteriaDeps) {
  const { progressQuest } = deps;

  return createInteractionMap(cafeteriaMessages, deps, {
    "11,10": ({ addItem, setPopup, gotKey, setGotKey }) => {
      if (!gotKey) {
        setPopup("Você pegou no linguição.");
        progressQuest("go_cafeteria", 1);

        addItem({ id: "sausage" });

        setGotKey?.(true);
      } else {
        setPopup("Nada mais aqui.");
      }
    },
  });
}
