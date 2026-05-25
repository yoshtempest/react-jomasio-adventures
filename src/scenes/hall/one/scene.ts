import { hallOne } from "@/maps/hall/one";

import { HALL_MUSIC } from "../../shared/music";
import { HALL_ROUTES, PCROOM_ROUTES, OTHER_ROUTES } from "../../shared/routes";

import { createDoorTile } from "../../shared/factories";

import type { SceneConfig } from "@/utils/types/maps/sceneConfig";

export const hallOneScene: SceneConfig = {
  id: "one",

  map: hallOne,

  audio: {
    src: HALL_MUSIC.default,
  },

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