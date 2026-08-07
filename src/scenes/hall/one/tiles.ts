import { createDoorTile, createConditionalTile } from "@/scenes/shared/factories";
import { hasFlag } from "@/scenes/shared/helpers";
import {
  HALL_ROUTES,
  CANTINA_ROUTES,
  PCROOM_ROUTES,
} from "@/scenes/shared/routes";

export const hallOneTiles = [
  createDoorTile(9, 0, HALL_ROUTES.JAILSON_ONE),
  createDoorTile(2, 8, HALL_ROUTES.LEFT_ONE),
  createConditionalTile(
    14,
    7,
    (_player, _quests, flags) => {
      if (hasFlag(flags, "chose_class")) {
        return PCROOM_ROUTES.TWO;
      }

      return PCROOM_ROUTES.ONE;
    },
  ),
  createDoorTile(8, 12, CANTINA_ROUTES.TWO),
  createDoorTile(9, 12, CANTINA_ROUTES.TWO),
  createDoorTile(10, 12, CANTINA_ROUTES.TWO),
];
