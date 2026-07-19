import { libraryMessages } from "@/data/dialogues/library/messages";
import { createInteractionMap, createPickupHandler } from "./builder";
import type { PickupDeps } from "@/utils/types/interaction";

type LibraryDeps = Omit<PickupDeps, "gotKey" | "setFlag"> & {
  packageDeps: { gotKey: boolean; setFlag: (flag: FlagId) => void };
  chestDeps: { gotKey: boolean; setFlag: (flag: FlagId) => void };
};

export function createLibrary(deps: LibraryDeps) {
  const messages = createInteractionMap(libraryMessages, {
    setPopup: deps.setPopup,
  });

  const packageHandler = createPickupHandler({
    item: { id: "package_01" },
    flagId: "picked_package_01",
    pickupMessage: "Uma embalagem com surpresinha",
    alreadyPickedMessage: "Nenhuma outra surpresinha por aqui.",
  });
  const chestHandler = createPickupHandler({
    item: { id: "rare_chest" },
    flagId: "picked_rare_chest",
    pickupMessage: "Um baú! Que sorte",
    alreadyPickedMessage: "Nada por aqui.",
  });

  messages["12,9"] = () => packageHandler({ ...deps, ...deps.packageDeps });
  messages["3,7"] = () => chestHandler({ ...deps, ...deps.chestDeps });

  return messages;
}
