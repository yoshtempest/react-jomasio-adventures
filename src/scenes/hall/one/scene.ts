import { hallOne } from "@/maps/hall/one";
import { getHallOneInitialPosition } from "@/scenes/hall/one/position";
import { MUSICS } from "@/scenes/shared/music";
import { hallOneTiles } from "./tiles";

export const oneScene: SceneConfig = {
  id: "one",
  className: "HallOne",
  initialPosition: getHallOneInitialPosition,
  map: hallOne,
  audio: { src: MUSICS.default },
  tiles: hallOneTiles,
};
