import { createConditionalTile } from "@/scenes/shared/factories";

import { HALL_ROUTES } from "@/scenes/shared/routes";
import { hasAnyQuest } from "@/scenes/shared/helpers";

export const afterPcRoomOneTiles = [
  createConditionalTile(
    9,
    11,

    (_player, quests) => {
      if (
        hasAnyQuest(quests, [
          "letter_delivery",
          "help_jailson",
          "x1_slimita",
        ])
      ) {
        return HALL_ROUTES.AFTER_PCROOM_ONE;
      }

      return HALL_ROUTES.ONE;
    }
  ),

  createConditionalTile(
    8,
    11,

    (_player, quests) => {
      if (
        hasAnyQuest(quests, [
          "letter_delivery",
          "help_jailson",
          "x1_slimita",
        ])
      ) {
        return HALL_ROUTES.AFTER_PCROOM_ONE;
      }

      return HALL_ROUTES.ONE;
    }
  ),
];