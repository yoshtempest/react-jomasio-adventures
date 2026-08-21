import {
  createDoorTile,
  createConditionalTile,
} from "@/scenes/shared/factories";
import { hasQuest } from "@/scenes/shared/helpers";
import { HALL_ROUTES, CANTINA_ROUTES } from "@/scenes/shared/routes";

export const centerOneTiles = [
  createDoorTile(16, 6, HALL_ROUTES.HELL),
  createConditionalTile(
    3,
    6,

    (_player, quests) => {
      if (hasQuest(quests, "explore_jorjao")) {
        return CANTINA_ROUTES.TWO;
      }

      return CANTINA_ROUTES.ONE;
    },
  ),
  createDoorTile(9, 1, HALL_ROUTES.CENTER_FRONT),
  createDoorTile(8, 12, HALL_ROUTES.LEFT_ONE),
  createDoorTile(9, 12, HALL_ROUTES.LEFT_ONE),
];
