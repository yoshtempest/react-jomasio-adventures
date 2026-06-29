import { cantinaMessages } from "@/data/maps/cantina/messages";
import { createInteractionMap } from "./builder";
import type { KeyDeps } from "@/utils/types/interaction";

export function createCantina(deps: KeyDeps) {
  return createInteractionMap(cantinaMessages, deps, {
    "13,4": ({ addItem, setPopup, gotKey, setGotKey }) => {
      if (!gotKey) {
        setPopup("Que delícia! um suco de laranja");

        addItem({ id: "orange_juice" });

        setGotKey?.(true);
      } else {
        setPopup("Nenhuma outra delícia por aqui.");
      }
    },
  });
}
