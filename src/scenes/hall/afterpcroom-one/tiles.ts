import {
  createConditionalTile,
  createDoorTile
} from "@/scenes/shared/factories";

import {
  HALL_ROUTES, 
  OTHER_ROUTES,
  PCROOM_ROUTES
} from "@/scenes/shared/routes";
import { hasQuest } from "@/scenes/shared/helpers";

export const afterPcRoomOneTiles = [
  createConditionalTile(
    9,
    2,

    (_player, quests) => {
      if (
        hasQuest(quests, "help_jailson")
      ) {
        return HALL_ROUTES.JAILSON_TWO;
      }

      return HALL_ROUTES.JAILSON_ONE;
    }
  ),

  createConditionalTile(
    8,
    2,

    (_player, quests) => {
      if (
        hasQuest(quests, "help_jailson")
      ) {
        return HALL_ROUTES.JAILSON_TWO;
      }

      return HALL_ROUTES.JAILSON_ONE;
    }
  ),

  createConditionalTile(
    7,
    2,

    (_player, quests) => {
      if (
        hasQuest(quests, "help_jailson")
      ) {
        return HALL_ROUTES.JAILSON_TWO;
      }

      return HALL_ROUTES.JAILSON_ONE;
    }
  ),
  createDoorTile(13, 7, PCROOM_ROUTES.SIX),
  createDoorTile(8, 11, OTHER_ROUTES.CANTINA_TWO),
  createDoorTile(1, 10, HALL_ROUTES.LEFT_ONE),
];