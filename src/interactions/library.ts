import { libraryMessages } from "@/data/dialogues/library/messages";
import { createInteractionMap, createPickupHandler } from "./builder";
import type { PickupDeps } from "@/utils/types/interaction";
import { hasQuest } from "@/scenes/shared/helpers";
import { LIBRARY_ROUTES } from "@/scenes/shared/routes";

type LibraryDeps = Omit<PickupDeps, "gotKey" | "setFlag"> & {
  quests: { id: string }[];
  navigate?: (to: string) => void;
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

  messages["15,9"] = () => packageHandler({ ...deps, ...deps.packageDeps });
  messages["3,5"] = () => chestHandler({ ...deps, ...deps.chestDeps });

  messages["14,2"] = () => {
    if (hasQuest(deps.quests, "save_ematron")) {
      deps.setPopup("O livro revela uma passagem secreta!");
      deps.navigate?.(LIBRARY_ROUTES.TWO);
      return;
    }
    deps.setPopup("Um livro empoeirado. Nada de especial.");
  };

  return messages;
}
