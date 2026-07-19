import {
  createConditionalTile,
  createDoorTile,
} from "@/scenes/shared/factories";
import {
  HALL_ROUTES,
  LIBRARY_ROUTES,
  BRODICLASS_ROUTES,
} from "@/scenes/shared/routes";
import { hasQuest } from "@/scenes/shared/helpers";

export const hallThirdClassTiles = [
  createConditionalTile(
    3,
    7,
    (_player, quests) => {
      if (hasQuest(quests, "x1_maugrelo")) {
        return BRODICLASS_ROUTES.ONE;
      }
      return null;
    },
    {
      blockedMessage:
        "Uma reunião do conselho está acontecendo no momento, volte mais tarde",
    },
  ),
  createDoorTile(8, 3, LIBRARY_ROUTES.ONE),
  createDoorTile(8, 11, HALL_ROUTES.CENTER_FRONT),
];
