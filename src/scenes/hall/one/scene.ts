import { hallOne } from "@/maps/hall/one";
import { getHallOneInitialPosition } from "@/scenes/hall/one/position";
import { MUSICS } from "@/scenes/shared/music";
import { hallOneTiles } from "./tiles";
import { sceneBackgrounds } from "@/data/scene/background";

export const oneScene: SceneConfig = {
  id: "one",
  background: sceneBackgrounds.HallOne,
  scaleFix: 1.4,
  initialPosition: getHallOneInitialPosition,
  map: hallOne,
  audio: { src: MUSICS.default },
  tiles: hallOneTiles,
};
