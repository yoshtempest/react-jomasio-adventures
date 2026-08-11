import {
  createConditionalTile,
  createDoorTile,
} from "@/scenes/shared/factories";

import {
  HALL_ROUTES,
  CANTINA_ROUTES,
  PCROOM_ROUTES,
} from "@/scenes/shared/routes";
import { hasQuest } from "@/scenes/shared/helpers";

export const afterPcRoomOneTiles = [
  createConditionalTile(
    9,
    0,

    (_player, quests) => {
      if (hasQuest(quests, "help_jailson") && !hasQuest(quests, "x1_slimita")) {
        return HALL_ROUTES.JAILSON_TWO;
      }

      return HALL_ROUTES.JAILSON_ONE;
    },
  ),

  createDoorTile(14, 6, PCROOM_ROUTES.SIX),
  createDoorTile(8, 12, CANTINA_ROUTES.TWO),
  createDoorTile(9, 12, CANTINA_ROUTES.TWO),
  createDoorTile(10, 12, CANTINA_ROUTES.TWO),
  createDoorTile(2, 8, HALL_ROUTES.LEFT_ONE),
];
