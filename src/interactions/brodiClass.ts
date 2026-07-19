import { brodiClassMessages } from "@/data/dialogues/brodiclass/messages";
import { createInteractionMap, createPickupHandler } from "./builder";
import type { PickupDeps } from "@/utils/types/interaction";

type BrodiClassDeps = Omit<PickupDeps, "gotKey" | "setFlag"> & {
  goatMeatDeps: { gotKey: boolean; setFlag: (flag: FlagId) => void };
  chestDeps: { gotKey: boolean; setFlag: (flag: FlagId) => void };
};

export function createBrodiClass(deps: BrodiClassDeps) {
  const messages = createInteractionMap(brodiClassMessages, {
    setPopup: deps.setPopup,
  });

  const packageHandler = createPickupHandler({
    item: { id: "goat_meat" },
    flagId: "picked_goat_meat",
    pickupMessage: "Por que tem carne de bode dentro de um baú?",
    alreadyPickedMessage:
      "Tá passando a mão na mesa por quê? Não tá vendo que não tem nada aí?",
  });
  const chestHandler = createPickupHandler({
    item: { id: "legendary_chest" },
    flagId: "picked_legendary_chest",
    pickupMessage: "Um baú! Que sorte",
    alreadyPickedMessage: "Nada por aqui.",
  });

  messages["7,6"] = () => packageHandler({ ...deps, ...deps.goatMeatDeps });
  messages["15,11"] = () => chestHandler({ ...deps, ...deps.chestDeps });

  return messages;
}
