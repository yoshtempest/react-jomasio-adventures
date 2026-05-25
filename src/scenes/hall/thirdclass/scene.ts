import { hallThirdClass } from "@/maps/hall/thirdClass";
import { HALL_MUSIC } from "@/scenes/shared/music";
import { HALL_ROUTES, PCROOM_ROUTES, OTHER_ROUTES } from "@/scenes/shared/routes";
import { getThirdClassInitialPosition } from "./position";
import { createDoorTile } from "@/scenes/shared/factories";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";


export const hallThirdClassScene: SceneConfig = {
  id: "thirdclass",
  initialPosition: getThirdClassInitialPosition,
  map: hallThirdClass,

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