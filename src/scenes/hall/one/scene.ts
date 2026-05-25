import { hallOne } from "@/maps/hall/one";
import { getHallOneInitialPosition } from "@/scenes/hall/one/position";
import { HALL_MUSIC } from "@/scenes/shared/music";
import { HALL_ROUTES, PCROOM_ROUTES, OTHER_ROUTES } from "@/scenes/shared/routes";

import { createDoorTile } from "@/scenes/shared/factories";

import type { SceneConfig } from "@/utils/types/maps/sceneConfig";

export const hallOneScene: SceneConfig = {
  id: "one",
  initialPosition: getHallOneInitialPosition,
  map: hallOne,
  audio: { src: HALL_MUSIC.default },

  tiles: [
    createDoorTile(
      8,
      2,
      HALL_ROUTES.JAILSON_ONE
    ),
    createDoorTile(
      1,
      10,
      HALL_ROUTES.LEFT_ONE
    ),
    createDoorTile(
      13,
      7,
      PCROOM_ROUTES.ONE
    ),
    createDoorTile(
      8,
      11,
      OTHER_ROUTES.CANTINA_TWO
    )
  ],
};