import { hallOneMessages } from "@/data/maps/hall/one/messages";
import { createInteractionMap } from "./builder";
import type { KeyDeps, InventoryDeps } from "@/utils/types/interaction";

type HallOneDeps = KeyDeps & InventoryDeps;

export function createHallOne(deps: HallOneDeps) {
  return createInteractionMap(hallOneMessages, deps, {
    "2,9": ({ hasItem, setPopup, removeItem, addItem }) => {
      if (hasItem("package_01")) {
        setPopup("Tome aqui sua embalagem");

        setTimeout(() => {
          removeItem("package_01");

          setPopup("Obrigada, eu estou precisando muito disso!");

          addItem({ id: "good_powder" });
        }, 5000);

        setTimeout(() => {
          setPopup(
            "Fique com isso, esse pó vai lhe ajudar a lutar infinitamente com aqueles rapazes, não faça perguntas, apenas aceite!",
          );
        }, 1000);
      } else {
        setPopup("Vai lá pegar o negócio pra mim, meu filho.");
      }
    },
  });
}
