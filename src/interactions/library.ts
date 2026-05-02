import { libraryMessages } from "@/data/maps/library/messages";
import { createInteractionMap } from "./builder";
import type { KeyDeps } from "@/utils/types/interaction";

export function createLibrary(deps: KeyDeps) {
  return createInteractionMap(libraryMessages, deps, {
    "12,9": ({ addItem, setPopup, gotKey, setGotKey }) => {
      if (!gotKey) {
        setPopup("Uma embalagem com surpresinha");

        addItem({
          id: "package_01",
          name: "Embalagem suspeita",
        });

        setGotKey?.(true);
      } else {
        setPopup("Nenhuma outra surpresinha por aqui.");
      }
    },
  });
}