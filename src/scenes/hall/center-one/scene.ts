import { hallCenter } from "@/maps/hall/center";
import { MUSICS } from "@/scenes/shared/music";
import { centerOneTiles } from "./tiles";
import { getCenterOneInitialPosition } from "./position";

export const centerOneScene: SceneConfig = {
  id: "center-one",
  className: "HallCenter",
  tiles: centerOneTiles,
  initialPosition: getCenterOneInitialPosition,
  map: hallCenter,
  audio: { src: MUSICS.default },
};
