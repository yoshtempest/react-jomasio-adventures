import { createConditionalTile } from "@/scenes/shared/factories";
import {
  DIRECTOR_ROUTES,
  HALL_ROUTES,
  CAFETERIA_ROUTES,
} from "@/scenes/shared/routes";
import { hasQuest } from "@/scenes/shared/helpers";
import { BLOCKED_MESSAGES } from "@/data/messages";

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
      blockedMessage: BLOCKED_MESSAGES.BLOCKED_PASSAGE,
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
      blockedMessage: BLOCKED_MESSAGES.BLOCKED_PASSAGE,
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
      blockedMessage: BLOCKED_MESSAGES.LOCKED_DOOR,
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
      blockedMessage: BLOCKED_MESSAGES.LOCKED_DOOR,
    },
  ),
];
