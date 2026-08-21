import {
  createDoorTile,
  createConditionalTile,
} from "@/scenes/shared/factories";
import { HALL_ROUTES, HELLROOM_ROUTES } from "@/scenes/shared/routes";
import { hasQuest } from "@/scenes/shared/helpers";

export const hellTiles = [
  createDoorTile(8, 12, HALL_ROUTES.CENTER_ONE),
  createDoorTile(9, 12, HALL_ROUTES.CENTER_ONE),
  createDoorTile(10, 12, HALL_ROUTES.CENTER_ONE),
  createConditionalTile(
    15,
    7,
    (_player, quests) => {
      if (hasQuest(quests, "go_to_hell") && !hasQuest(quests, "x1_maugrelo")) {
        return HELLROOM_ROUTES.ONE;
      }
      if (hasQuest(quests, "go_to_hell") && hasQuest(quests, "x1_maugrelo")) {
        return HELLROOM_ROUTES.FOUR;
      }
      return null;
    },
    {
      blockedMessage: "Porta trancada",
    },
  ),
  createConditionalTile(
    10,
    2,
    (_player, quests) => {
      if (hasQuest(quests, "go_to_pandemony")) {
        return HALL_ROUTES.PANDEMONY;
      }
      return null;
    },
    {
      blockedMessage:
        "Portão trancado, perigo extremo, há um monstro aprisionado mais a dentro.",
    },
  ),
  createConditionalTile(
    9,
    2,
    (_player, quests) => {
      if (hasQuest(quests, "go_to_pandemony")) {
        return HALL_ROUTES.PANDEMONY;
      }
      return null;
    },
    {
      blockedMessage:
        "Portão trancado, perigo extremo, há um monstro aprisionado mais a dentro.",
    },
  ),
];
