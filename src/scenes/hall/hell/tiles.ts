import { createDoorTile, createConditionalTile } from "@/scenes/shared/factories";
import {
  HALL_ROUTES,
  HELLROOM_ROUTES
} from "@/scenes/shared/routes";
import { hasQuest } from "@/scenes/shared/helpers";

export const hellTiles = [
  createDoorTile(8, 11, HALL_ROUTES.CENTER_ONE),
  createConditionalTile(
      11,
      7,
      (_player, quests) => {
      if (hasQuest(quests, "go_to_hell")) {
          return HELLROOM_ROUTES.ONE;
      }
      return null;
      },
      {
          blockedMessage: "Porta trancada"
      }
  ),
];