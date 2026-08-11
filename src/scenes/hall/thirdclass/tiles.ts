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
      if (hasQuest(quests, "go_to_brodiclass")) {
        return BRODICLASS_ROUTES.ONE;
      }
      return null;
    },
    {
      blockedMessage:
        "Uma reunião do conselho está acontecendo no momento, volte mais tarde",
    },
  ),
  createDoorTile(9, 2, LIBRARY_ROUTES.ONE),
  createDoorTile(10, 2, LIBRARY_ROUTES.ONE),
  createDoorTile(8, 12, HALL_ROUTES.CENTER_FRONT),
  createDoorTile(9, 12, HALL_ROUTES.CENTER_FRONT),
  createDoorTile(10, 12, HALL_ROUTES.CENTER_FRONT),
];
