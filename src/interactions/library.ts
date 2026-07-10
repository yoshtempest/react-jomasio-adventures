import { libraryMessages } from "@/data/dialogues/library/messages";
import { createInteractionMap, createPickupHandler } from "./builder";
import type { PickupDeps } from "@/utils/types/interaction";

type LibraryDeps = Omit<PickupDeps, "gotKey" | "setGotKey"> & {
  packageDeps: { gotKey: boolean; setGotKey: React.Dispatch<React.SetStateAction<boolean>> };
  chestDeps: { gotKey: boolean; setGotKey: React.Dispatch<React.SetStateAction<boolean>> };
};

export function createLibrary(deps: LibraryDeps) {
  const messages = createInteractionMap(libraryMessages, { setPopup: deps.setPopup });

  const packageHandler = createPickupHandler({
    item: { id: "package_01" },
    pickupMessage: "Uma embalagem com surpresinha",
    alreadyPickedMessage: "Nenhuma outra surpresinha por aqui.",
  });
  const chestHandler = createPickupHandler({
    item: { id: "rare_chest" },
    pickupMessage: "Um baú! Que sorte",
    alreadyPickedMessage: "Nada por aqui.",
  });

  messages["12,9"] = () => packageHandler({ ...deps, ...deps.packageDeps });
  messages["3,7"] = () => chestHandler({ ...deps, ...deps.chestDeps });

  return messages;
}
