import {
  createConditionalTile,
  createDoorTile,
} from "@/scenes/shared/factories";
import {
  DIRECTOR_ROUTES,
  HALL_ROUTES,
  CAFETERIA_ROUTES,
} from "@/scenes/shared/routes";
import { hasAnyQuest, hasQuest } from "@/scenes/shared/helpers";

export const cantinaTwoTiles = [
  createDoorTile(2, 3, HALL_ROUTES.CENTER_ONE),
  createConditionalTile(
    10,
    3,
    (_player, quests) => {
      if (hasQuest(quests, "director_escape")) {
        return DIRECTOR_ROUTES.TWO;
      }
      return null;
    },
    {
      blockedMessage: "Porta trancada",
    },
  ),
  createConditionalTile(
    6,
    2,
    (_player, quests) => {
      if (hasQuest(quests, "denis_sausage")) {
        return CAFETERIA_ROUTES.FOUR;
      } else if (hasQuest(quests, "go_cafeteria")) {
        return CAFETERIA_ROUTES.ONE;
      }
      return null;
    },
    {
      blockedMessage: "Porta trancada",
    },
  ),
  createConditionalTile(15, 11, (_player, quests) => {
    if (
      hasAnyQuest(quests, [
        "encounter_deise",
        "go_cafeteria",
        "search_packaging",
        "letter_delivery",
      ])
    ) {
      return HALL_ROUTES.AFTER_PCROOM_ONE;
    }
    return HALL_ROUTES.ONE;
  }),
];
