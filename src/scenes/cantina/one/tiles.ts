import { createConditionalTile } from "@/scenes/shared/factories";
import {
  DIRECTOR_ROUTES,
  HALL_ROUTES,
  CAFETERIA_ROUTES,
} from "@/scenes/shared/routes";
import { hasQuest } from "@/scenes/shared/helpers";

export const cantinaOneTiles = [
  createConditionalTile(
    2,
    3,
    (_player, quests) => {
      if (hasQuest(quests, "explore_jorjao")) {
        return HALL_ROUTES.CENTER_ONE;
      }
      return null;
    },
    {
      blockedMessage: "Passagem bloqueada",
    },
  ),
  createConditionalTile(
    1,
    3,
    (_player, quests) => {
      if (hasQuest(quests, "explore_jorjao")) {
        return HALL_ROUTES.CENTER_ONE;
      }
      return null;
    },
    {
      blockedMessage: "Passagem bloqueada",
    },
  ),
  createConditionalTile(
    12,
    2,
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
    7,
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
];
