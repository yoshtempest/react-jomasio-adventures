import { cafeteriaMessages } from "@/data/maps/cafeteria/messages";
import { createInteractionMap } from "./builder";
import type { KeyDeps, InventoryDeps, QuestDeps } from "@/utils/types/interaction";
import { arcadeSpecialEventDialogue } from "@/data/maps/arcade/specialEvent"

type ArcadeDeps = KeyDeps & InventoryDeps & QuestDeps;

export function createArcade(deps: ArcadeDeps) {

  if (randomChoice = 101 || 110 || 011) {
    selectableYvelCharacter = true
  }
  const { progressQuest } = deps;

  return createInteractionMap(cafeteriaMessages, deps, {
    "11,10": ({ setPopup }) => {
      pressButton()
      setPopup("ERR: eVenT unespeCt3d...");
      dialogueData: arcadeSpecialEventDialogue;
    },
  });
}
