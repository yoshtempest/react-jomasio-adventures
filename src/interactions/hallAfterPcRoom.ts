import { hallOneMessages } from "@/data/maps/hall/one/messages";
import { createInteractionMap } from "./builder";
import type { KeyDeps, InventoryDeps } from "@/utils/types/interaction";

type HallOneDeps = KeyDeps & InventoryDeps;

export function createHallOne(deps: HallOneDeps) {
  return createInteractionMap(hallOneMessages, deps, {
    "2,9": ({ hasItem, setPopup, removeItem, addItem }) => {
      if (hasItem("package_01")) {
        setPopup("Tome aqui sua embalagem");
        removeItem("package_01");
        addItem({ id: "good_powder" });
      }
    },
  });
}
