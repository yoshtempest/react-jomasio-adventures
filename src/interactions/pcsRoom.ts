import { pcsRoomMessages } from "@/data/maps/pcsRoom/messages";
import { createInteractionMap } from "./builder";
import type { KeyDeps } from "@/utils/types/interaction";

export function createPcsRoom(deps: KeyDeps) {
  return createInteractionMap(pcsRoomMessages, deps, {
    "7,3": ({ addItem, setPopup, gotKey, setGotKey }) => {
      if (!gotKey) {
        setPopup("Uma engrenagem, Era essa a peça que eu queria!");

        addItem({
          id: "desired_gear",
          name: "Peça desejada",
        });

        setGotKey?.(true);
      } else {
        setPopup("Nenhuma outra peça por aqui.");
      }
    },
  });
}