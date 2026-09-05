import { createConditionalTile } from "@/scenes/shared/factories";
import { HALL_ROUTES } from "@/scenes/shared/routes";
import { hasFlag } from "@/scenes/shared/helpers";
import { BLOCKED_MESSAGES } from "@/data/messages";

export const hellRoomTwoTiles = [
  createConditionalTile(
    9,
    3,
    (_player, _quests, flags) => {
      if (hasFlag(flags, "maugrelo")) {
        return HALL_ROUTES.HELL;
      }
      return null;
    },
    {
      blockedMessage: BLOCKED_MESSAGES.LOCKED_DOOR,
    },
  ),
];
